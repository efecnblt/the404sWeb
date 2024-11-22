import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (!userData) return <div>User data not found.</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <img
                    src={userData.image_url || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold text-center">{userData.name}</h2>
                <p className="text-center text-gray-600">@{userData.username}</p>
                <div className="mt-6">
                    <h3 className="font-bold mb-2">Email</h3>
                    <p>{userData.email}</p>
                </div>
                <div className="mt-4">
                    <h3 className="font-bold mb-2">Favorites</h3>
                    <ul className="list-disc list-inside">
                        {userData.favorites &&
                            userData.favorites.map((fav, index) => (
                                <li key={index}>
                                    Author: {fav.author_id}, Course: {fav.course_id}
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Profile;
