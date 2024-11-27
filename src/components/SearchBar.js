import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import {Link, useLocation, useNavigate} from "react-router-dom";

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState(""); // Kullanıcı arama terimi
    const [courses, setCourses] = useState([]); // Tüm kurslar
    const [filteredResults, setFilteredResults] = useState([]); // Filtrelenmiş sonuçlar
    const location = useLocation(); // Rota değişikliğini izlemek için


    // Firebase'den tüm kursları çekme
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const authorsSnapshot = await getDocs(collection(db, "authors"));
                let allCourses = [];

                for (const authorDoc of authorsSnapshot.docs) {
                    const coursesSnapshot = await getDocs(
                        collection(db, `authors/${authorDoc.id}/courses`)
                    );
                    const authorCourses = coursesSnapshot.docs.map((courseDoc) => ({
                        id: courseDoc.id,
                        authorId: authorDoc.id, // Author ID buradan ekleniyor
                        authorName: authorDoc.data().name,
                        ...courseDoc.data(),
                    }));
                    allCourses = [...allCourses, ...authorCourses];
                }

                setCourses(allCourses);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchCourses();
    }, []);

    // Arama terimine göre filtreleme
    useEffect(() => {
        if (searchTerm === "") {
            setFilteredResults([]); // Arama terimi boşsa sonuçları sıfırla
        } else {
            const results = courses.filter((course) => {
                const matchesName = course.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());
                const matchesHashtags =
                    course.hashtags &&
                    course.hashtags.some((tag) =>
                        tag.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                const matchesAuthorName = course.authorName
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

                return matchesName || matchesHashtags || matchesAuthorName;
            });
            setFilteredResults(results.slice(0, 5)); // Maksimum 5 sonuç göster
        }
    }, [searchTerm, courses]);

    // Rota değişikliğinde arama çubuğunu sıfırla
    const onClear = () => {
        setSearchTerm(""); // Arama terimini sıfırla
        setFilteredResults([]); // Filtrelenmiş sonuçları temizle
    };

    return (
        <div className="relative  w-full max-w-lg">
            {/* Arama Çubuğu */}
            <input
                type="text"
                placeholder="Search Anything"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 w-full  border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <span className="absolute right-3 top-2.5 text-gray-500">🔍</span>

            {/* Arama Sonuçları */}
            {filteredResults.length > 0 && (
                <div className="absolute top-12 left-0 bg-white shadow-lg rounded-lg w-full max-w-lg z-10"
                     onMouseLeave={() => onClear && onClear()} // Kullanıcı başka bir yere tıklarsa sonuçları gizle
                >
                    <ul>
                        {filteredResults.map((course) => (
                            <Link

                                to={`/app/home/course/${course.authorId}/${course.id}`}
                                key={course.id}
                                className="block p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            >
                                <img
                                    src={course.image_url || "https://via.placeholder.com/40"}
                                    alt={course.name}
                                    className="w-10 h-10 rounded-full mr-2"
                                />
                                <div>
                                    <p className="text-sm font-bold text-gray-800">{course.name}</p>
                                    <p className="text-xs text-gray-500">{course.authorName}</p>
                                </div>
                            </Link>
                        ))}
                    </ul>
                </div>
            )}

            {/* Eğer eşleşen kurs yoksa mesaj göster */}
            {filteredResults.length === 0 && searchTerm && (
                <p className="absolute top-12 left-0 text-gray-500 bg-white p-2 rounded-lg shadow-lg w-64">
                    No results found for "{searchTerm}"
                </p>
            )}

        </div>
    );
}

export default SearchBar;
