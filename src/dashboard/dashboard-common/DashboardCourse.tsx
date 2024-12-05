import { Link } from "react-router-dom"
import {useEffect, useState} from "react";
import {useAuth} from "../../firebase/AuthContext.tsx";
import {collection, doc, getDoc, getDocs} from "firebase/firestore";
import {db} from "../../firebase/firebaseConfig.ts";




const fetchFavoritesWithDetails = async (userId: string) => {
    try {
        const userDocRef = doc(db, `users/${userId}`);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            console.error("Kullanıcı dokümanı bulunamadı.");
            return [];
        }

        const userData = userDoc.data();
        const favorites = userData.favorites ? Object.values(userData.favorites) : [];
        console.log("Favorites:", favorites); // Favorileri kontrol etmek için

        const favoriteCourses = [];

        // Favoriler için kurs ve eğitmen bilgilerini çekme
        const promises = favorites.map(async (favorite) => {
            const { authorId, courseId } = favorite;

            // Kurs ve eğitmen bilgilerini eşzamanlı olarak çekme
            const courseDocRef = doc(db, `authors/${authorId}/courses/${courseId}`);
            const authorDocRef = doc(db, `authors/${authorId}`);

            const [courseDoc, authorDoc] = await Promise.all([
                getDoc(courseDocRef),
                getDoc(authorDocRef),
            ]);

            const courseData = courseDoc.exists() ? courseDoc.data() : null;
            const authorData = authorDoc.exists() ? authorDoc.data() : null;

            if (!courseData || !authorData) {
                // Kurs veya eğitmen bilgileri bulunamadıysa, bu favoriyi atla
                return;
            }

            // Toplam ders sayısı ve toplam süreyi hesaplamak için değişkenler
            let totalLessons = 0;
            let totalDurationInSeconds = 0;

            // Bölümleri ve videoları çekme
            const sectionsRef = collection(
                db,
                `authors/${authorId}/courses/${courseId}/sections`
            );
            const sectionsSnapshot = await getDocs(sectionsRef);

            const sectionPromises = sectionsSnapshot.docs.map(async (sectionDoc) => {
                const sectionId = sectionDoc.id;

                // Bölüm altındaki videoları çekme
                const videosRef = collection(
                    db,
                    `authors/${authorId}/courses/${courseId}/sections/${sectionId}/videos`
                );
                const videosSnapshot = await getDocs(videosRef);

                totalLessons += videosSnapshot.size;

                // Videoların sürelerini toplama
                videosSnapshot.docs.forEach((videoDoc) => {
                    const videoData = videoDoc.data();
                    // `duration` değerini doğru birime çevirin
                    const durationInSeconds = videoData.duration * 1; // Örneğin, dakika ise saniyeye çevir
                    totalDurationInSeconds += durationInSeconds;


                });
            });

            await Promise.all(sectionPromises);

            // Toplam süreyi okunabilir formata dönüştürme (örn: "2h 30m")
            const totalDuration = formatDuration(totalDurationInSeconds);

            // Kurs verilerine toplam ders sayısı ve süreyi ekleme
            const enrichedCourseData = {
                ...courseData,
                totalLessons,
                totalDuration,
            };

            favoriteCourses.push({
                authorId,
                courseId,
                courseData: enrichedCourseData,
                authorData,
            });
        });

        await Promise.all(promises);

        return favoriteCourses;
    } catch (error) {
        console.error("Favoriler çekilirken hata oluştu:", error);
        return [];
    }
};

const formatDuration = (totalSeconds: number) => {
    if (totalSeconds <= 0) return "0s";

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    let durationString = "";
    if (hours > 0) {
        durationString += `${hours}h `;
    }
    if (minutes > 0) {
        durationString += `${minutes}m `;
    }
    if (seconds > 0 && hours === 0) {
        // Sadece saat yoksa saniyeleri göster
        durationString += `${seconds}s`;
    }
    return durationString.trim();
};



const DashboardCourse = () => {
    const [favoriteCourses, setFavoriteCourses] = useState<any[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        const getFavorites = async () => {
            if (user?.id) {
                const favorites = await fetchFavoritesWithDetails(user.id);
                setFavoriteCourses(favorites);
            }
        };

        getFavorites();
    }, [user?.id]);

    return (
        <div className="progress__courses-wrap">
            <div className="dashboard__content-title">
                <h4 className="title">In Progress Courses</h4>
            </div>
            <div className="row">
                {favoriteCourses.length > 0 ? (
                    favoriteCourses.map((item, index) => {
                        const { courseData, authorData} = item;

                        return (
                            <div key={item.id || index} className="col-xl-4 col-md-6">
                                <div className="courses__item courses__item-two shine__animate-item">
                                    <div className="courses__item-thumb courses__item-thumb-two">
                                        <Link
                                            to={`/course-details/${item.authorId}/${item.courseId}`}
                                            className="shine__animate-link"
                                        >
                                            <img
                                                src={courseData?.image_url || "default-image.jpg"}
                                                alt="Kurs Görseli"
                                            />
                                        </Link>
                                    </div>
                                    <div className="courses__item-content courses__item-content-two">
                                        <ul className="courses__item-meta list-wrap">
                                            <li className="courses__item-tag">
                                                <Link to={`/courses`}>{courseData?.department || "Genel"}</Link>
                                            </li>
                                        </ul>
                                        <h5 className="title">
                                            <Link
                                                to={`/course-details/${item.authorId}/${item.courseId}`}
                                            >
                                                {courseData?.name || "Kurs Başlığı"}
                                            </Link>
                                        </h5>
                                        <div className="courses__item-content-bottom">
                                            <div className="author-two">
                                                <Link to={`/instructor-details/${item.authorId}`}>
                                                    <img
                                                        src={
                                                            authorData?.image_url ||
                                                            "default-avatar.jpg"
                                                        }
                                                        alt="Eğitmen Görseli"
                                                    />
                                                    {authorData?.name || "Eğitmen Adı"}
                                                </Link>
                                            </div>
                                            <div className="avg-rating">
                                                <i className="fas fa-star"></i>{" "}
                                                ({courseData?.rating || "0"} Reviews)
                                            </div>
                                        </div>
                                    </div>
                                    <div className="courses__item-bottom-two">
                                        <ul className="list-wrap">
                                            <li>
                                                <i className="flaticon-book"></i>
                                                {courseData?.totalLessons || 0}
                                            </li>
                                            <li>
                                                <i className="flaticon-clock"></i>
                                                {courseData?.totalDuration || "0s"}
                                            </li>
                                            <li>
                                                <i className="flaticon-mortarboard"></i>
                                                {courseData?.level || "Tüm Seviyeler"}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p
                        style={{
                            fontSize: "18px",
                            textAlign: "center",
                            marginTop: "20px",
                        }}
                    >
                        Devam eden kurs bulunamadı.
                    </p>
                )}
            </div>
        </div>
    );
}

export default DashboardCourse
