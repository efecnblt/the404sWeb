import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";

function CourseDetail() {
    const { authorId, courseId } = useParams(); // URL'den authorId ve courseId alınır
    const [courseInfo, setCourseInfo] = useState(null); // Kurs bilgileri
    const [sections, setSections] = useState([]); // Section listesi
    const [loading, setLoading] = useState(true); // Yükleniyor durumu

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                // Kurs bilgilerini çek
                const courseRef = doc(db, `authors/${authorId}/courses/${courseId}`);
                const courseSnap = await getDoc(courseRef);

                if (courseSnap.exists()) {
                    setCourseInfo(courseSnap.data());
                } else {
                    console.error("Course not found in Firebase.");
                }

                // Section bilgilerini çek
                const querySnapshot = await getDocs(
                    collection(db, `authors/${authorId}/courses/${courseId}/sections`)
                );
                const sectionsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setSections(sectionsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching course data or sections: ", error);
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [authorId, courseId]);

    if (loading) {
        return <p className="text-center">Loading course details...</p>;
    }

    if (!courseInfo) {
        return <p className="text-center">Course not found.</p>;
    }

    return (
        <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sol Bölüm: Kurs Detayları */}
                <div className="bg-white p-6 shadow-lg rounded-lg lg:col-span-1">
                    <img
                        src={courseInfo.image_url || "https://via.placeholder.com/150"}
                        alt={courseInfo.name}
                        className="w-full h-40 object-cover rounded-md mb-4"
                    />
                    <h1 className="text-2xl font-bold mb-2">{courseInfo.name}</h1>
                    <p className="text-sm text-gray-500 mb-2">By {courseInfo.authorName}</p>
                    <div className="flex items-center mb-4">
                        <span className="text-yellow-500 text-lg mr-1">⭐</span>
                        <span className="text-sm font-medium">{courseInfo.rating}</span>
                        <span className="text-gray-400 text-sm ml-2">
                            ({courseInfo.ratingCount} ratings)
                        </span>
                    </div>
                    <p className="text-gray-600">{courseInfo.description}</p>
                </div>

                {/* Sağ Bölüm: Kursun Bölümleri */}
                <div className="bg-white p-6 shadow-lg rounded-lg lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Course Sections</h2>
                    {sections.map((section) => (
                        <div key={section.id} className="mb-4 p-4 bg-gray-100 rounded-lg">
                            <h3 className="text-lg font-semibold">{section.title}</h3>
                            <p>{section.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CourseDetail;
