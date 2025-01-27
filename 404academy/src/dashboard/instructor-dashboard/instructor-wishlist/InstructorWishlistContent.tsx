import { Link } from "react-router-dom"
import {useEffect, useState} from "react";
import {useAuth} from "../../../firebase/AuthContext.tsx";







const InstructorWishlistContent = () => {
    const [favoriteCourses, setFavoriteCourses] = useState<any[]>([]);
    const { user } = useAuth();

    const fetchFavoritesWithDetails = async (studentId: number) => {
        try {
            const favoriteCourses = [];

            // 1. Kullanıcının favori kurslarını kontrol etmek için API çağrısı yap
            const response = await fetch(`http://165.232.76.61:5001/api/FavoriteCourses/getFavorites?studentId=${studentId}`);
            const studentCourses = await response.json();

            if (!studentCourses || studentCourses.length === 0) {
                console.error("Favoriler bulunamadı.");
                return [];
            }

            // 2. Her favori kurs için detayları çekmek
            const promises = studentCourses.map(async (favorite: any) => {
                const courseId = favorite.courseID;

                // Kurs bilgilerini al
                const courseResponse = await fetch(`http://165.232.76.61:5001/api/Courses/getbyid?id=${courseId}`);
                const courseData = await courseResponse.json();

                const authorId = courseData.data.authorId;

                const authorResponse = await fetch(`http://165.232.76.61:5001/api/Authors/getbyid/${authorId}`);
                const authorData = await authorResponse.json();

                return {
                    courseId,
                    courseData,
                    authorData,
                };
            });

            // Tüm favori kursların detaylarını bekle
            const detailedFavorites = await Promise.all(promises);
            return detailedFavorites;
        } catch (error) {
            console.error("Favoriler çekilirken hata oluştu:", error);
            return [];
        }
    };


    useEffect(() => {
        const getFavorites = async () => {
            if (user?.studentId) {
                const favorites = await fetchFavoritesWithDetails(user.studentId);
                setFavoriteCourses(favorites);
            }
        };

        getFavorites();
    }, [user?.studentId]);


    return (
        <div className="col-lg-9">
            <div className="dashboard__content-wrap dashboard__content-wrap-two">
                <div className="dashboard__content-title">
                    <h4 className="title">Favorites</h4>
                </div>
                <div className="row">
                    {favoriteCourses.length > 0 ? (
                        favoriteCourses.map((item, index) => {
                            const { courseData, authorData } = item;
                            return (
                                <div key={index} className="col-xl-4 col-md-6">
                                    <div className="courses__item courses__item-two shine__animate-item">
                                        <div className="courses__item-thumb courses__item-thumb-two">
                                            <Link
                                                to={`/course-details/${authorData.authorId}/${item.courseId}`}
                                                className="shine__animate-link"
                                            >
                                                <img
                                                    src={
                                                        courseData?.data.image_url ||
                                                        "https://via.placeholder.com/300"
                                                    }
                                                    alt="Kurs Görseli"
                                                />
                                            </Link>
                                        </div>
                                        <div className="courses__item-content courses__item-content-two">
                                            <ul className="courses__item-meta list-wrap">
                                                <li className="courses__item-tag">
                                                    <Link to={`/course`}>
                                                        {courseData?.department || "Genel"}
                                                    </Link>
                                                </li>
                                                {courseData?.price && (
                                                    <li className="price">
                                                        {courseData?.old_price && (
                                                            <del>${courseData.old_price}</del>
                                                        )}
                                                        ${courseData.price}
                                                    </li>
                                                )}
                                            </ul>
                                            <h5 className="title">
                                                <Link
                                                    to={`/course-details/${item.courseId}`}
                                                >
                                                    {courseData?.data.name || "Kurs Başlığı"}
                                                </Link>
                                            </h5>
                                            <div className="courses__item-content-bottom">
                                                <div className="author-two">
                                                    <Link to={`/instructor-details/${item.authorId}`}>
                                                        <img
                                                            src={
                                                                authorData?.image_url ||
                                                                "https://via.placeholder.com/100"
                                                            }
                                                            alt="Eğitmen Görseli"
                                                        />
                                                        {authorData?.name || "Bilinmeyen Eğitmen"}
                                                    </Link>
                                                </div>
                                                <div className="avg-rating">
                                                    <i className="fas fa-star"></i>{" "}
                                                    ({courseData?.rating || "Değerlendirme Yok"} Reviews)
                                                </div>
                                            </div>
                                        </div>
                                        <div className="courses__item-bottom-two">
                                            <ul className="list-wrap">
                                                <li>
                                                    <i className="flaticon-book"></i>
                                                    {item.courseData?.totalLessons || 0}
                                                </li>
                                                <li>
                                                    <i className="flaticon-clock"></i>
                                                    {item.courseData?.totalDuration  || "0s"}
                                                </li>
                                                <li>
                                                    <i className="flaticon-mortarboard"></i>
                                                    {item.courseData?.studentCount || "Tüm Seviyeler"}
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
                            Favori bulunamadı.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InstructorWishlistContent
