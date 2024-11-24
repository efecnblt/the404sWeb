import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {auth, db} from "../firebase/firebaseConfig";
import {doc, getDoc} from "firebase/firestore";
import {onAuthStateChanged} from "firebase/auth";

function Header() {
    const [userData, setUserData] = useState(null);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                setUserData(null); // Kullanıcı oturumu kapattığında
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut(); // Oturumu kapat
            navigate("/"); // Landing Page'e yönlendir
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
            {/* Logo ve Başlık */}
            <div className="flex items-center space-x-2">
                {/*font-leckerli*/}
                <Link to="/app/home" className="hover:text-purple-600 text-2xl font-leckerli font-bold text-gray-600">
                    404 Academy
                </Link>
            </div>

            {/* Menü Öğeleri */}
            <nav className="flex items-center space-x-6 text-gray-700 relative">
                {/* Categories Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                        className="hover:text-purple-600 "
                    >
                        Categories ▾
                    </button>
                    {isCategoriesOpen && (
                        <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md w-48">
                            <Link
                                to="/categories/science"
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Science
                            </Link>
                            <Link
                                to="/categories/technology"
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Technology
                            </Link>
                            <Link
                                to="/categories/math"
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Math
                            </Link>
                        </div>
                    )}
                </div>
                <Link to="/app/home/teach" className="hover:text-purple-600">
                    Teach
                </Link>
                <Link to="/app/home/contact" className="hover:text-purple-600">
                    Contact Us
                </Link>
                <Link to="/app/home/about" className="hover:text-purple-600">
                    About Us
                </Link>
            </nav>

            {/* Arama Çubuğu ve Profil */}
            <div className="flex items-center space-x-6">
                {/* Arama Çubuğu */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search Anything"
                        className="px-4 py-2 w-64 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-500">
                        🔍
                    </span>
                </div>

                {/* Profil Dropdown */}
                {userData && (
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center space-x-2"
                        >
                            {/* Profil ve Logo İçeren Container */}
                            <div className="profile-container relative">


                                {/* Profil Resmi */}
                                <img
                                    src={userData.image_url || "https://via.placeholder.com/40"}
                                    alt="Profile"
                                    className="profile-image w-12 h-12 rounded-full border-4 border-white shadow-lg"
                                />

                            </div>
                            {/* Kullanıcı Adı */}
                            <span className="text-sm font-bold">{userData.name}</span>
                        </button>
                        {/* Profil Açılır Kart */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-48">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    My Account
                                </Link>
                                <Link
                                    to="/settings"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </header>
    );
}

export default Header;
