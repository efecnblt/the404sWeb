import { Link } from "react-router-dom"
import {useEffect, useState} from "react";
import { useAuth } from "../../firebase/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";






const DashboardCourse = () => {
    const [favoriteCourses] = useState<any[]>([]);
    const { user } = useAuth();
    const [isInstructor, setIsInstructor] = useState(false);


    useEffect(() => {
      const fetchUserRole = async () => {
         try {
            const roleResponse = await axios.get(`http://165.232.76.61:5001/api/Users/getclaims/${user?.id}`);
            const roles = roleResponse.data;

            // Check if the user has the role of "Author" (instructor)
            const isAuthor = roles.some(role => role.name === "Author");
            setIsInstructor(isAuthor);
         } catch (error) {
            console.error("Error fetching user role:", error);
            toast.error("Failed to load user role");
         }
      };
      fetchUserRole(); // Fetch user role first
    }, [user]);

    if (isInstructor) {
        return null;
    } 

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
