import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const CoursePage = () => {
    const { courseId } = useParams(); // URL'den gelen birleşik parametre (authorId.courseId)
    const [authorId, setAuthorId] = useState(""); // Ayrıştırılmış authorId
    const [separateCourseId, setSeparateCourseId] = useState(""); // Ayrıştırılmış courseId
    const [courseInfo, setCourseInfo] = useState(null); // Kurs bilgileri
    const [sections, setSections] = useState([]); // Section listesi
    const [selectedVideo, setSelectedVideo] = useState(null); // Seçili video
    const [loading, setLoading] = useState(true); // Yükleniyor durumu


    // URL'den gelen birleşik parametreyi ayrıştırma
    useEffect(() => {
        if (courseId) {
            const [extractedAuthorId, extractedCourseId] = courseId.split(".");
            setAuthorId(extractedAuthorId);
            setSeparateCourseId(extractedCourseId);
        }
    }, [courseId]);

    // Firebase'den Kurs ve Section Verilerini Çekme
    useEffect(() => {
        const fetchCourseData = async () => {
            if (!authorId || !separateCourseId) return;

            console.log("Fetching course data...");
            console.log("authorId:", authorId);
            console.log("courseId:", separateCourseId);

            try {
                const courseRef = doc(db, "authors", authorId, "courses", separateCourseId);
                const courseSnap = await getDoc(courseRef);

                if (courseSnap.exists()) {
                    console.log("Course data:", courseSnap.data());
                    setCourseInfo(courseSnap.data());
                } else {
                    console.error("Course not found in Firebase.");
                }
            } catch (error) {
                console.error("Error fetching course data:", error);
            }
        };

        fetchCourseData();
    }, [authorId, separateCourseId]);


    if (loading) {
        return <p className="text-center">Loading course data...</p>;
    }

    if (!courseInfo) {
        return <p className="text-center">Course not found!</p>;
    }

    return (
        <div className="flex h-screen">
            {/* Sol Kısım: Video Oynatıcı ve Kurs Bilgileri */}
            <div className="w-2/3 p-6 bg-gray-100">
                {selectedVideo ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">{selectedVideo.title}</h2>
                        <iframe
                            title={selectedVideo.title}
                            width="100%"
                            height="400px"
                            src={`https://www.youtube.com/embed/${selectedVideo.url.split("v=")[1]}`}
                            frameBorder="0"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Select a video to play</h2>
                    </div>
                )}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold">{courseInfo.name}</h1>
                    <p className="text-gray-700 mt-2">{courseInfo.description}</p>
                    <p className="text-sm text-gray-500 mt-4">Department: {courseInfo.department}</p>
                </div>
            </div>

            {/* Sağ Kısım: Section ve Video Listesi */}
            <div className="w-1/3 p-6 bg-white shadow-lg">
                <h2 className="text-xl font-bold mb-4">Course Sections</h2>
                <div className="space-y-4">
                    {sections.map((section) => (
                        <div key={section.id} className="border-b pb-4">
                            <h3 className="text-lg font-semibold">{section.title}</h3>
                            <ul className="mt-2 space-y-2">
                                {section.videos.map((video) => (
                                    <li
                                        key={video.id}
                                        onClick={() => setSelectedVideo(video)}
                                        className="cursor-pointer text-blue-500 hover:underline"
                                    >
                                        {video.title} ({video.duration} mins)
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CoursePage;
