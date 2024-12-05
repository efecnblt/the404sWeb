import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import {Link} from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";


const tab_title: string[] = ["All Courses", "Design", "Business", "Development"];



interface CourseAreaProps {
  style: boolean;
}

interface Course {
  id: string;
  course_name: string;
  image_url: string;
  department: string;
  rating: number;
  studentCount: number;
  courseCount: number;
  author_name: string;
}


const CourseArea = ({ style }: CourseAreaProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);


  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const authorsSnapshot = await getDocs(collection(db, "authors"));
        let allCourses: Course[] = [];

        for (const authorDoc of authorsSnapshot.docs) {
          const coursesSnapshot = await getDocs(
              collection(db, `authors/${authorDoc.id}/courses`)
          );

          const authorCourses: Course[] = coursesSnapshot.docs.map((courseDoc) => ({
            id: `${authorDoc.id}.${courseDoc.id}`,
            course_name: courseDoc.data().name || "Default Title",
            image_url: courseDoc.data().image_url || "default-thumb.jpg",
            department: courseDoc.data().department || "General",
            rating: courseDoc.data().rating || 0,
            studentCount: courseDoc.data().studentCount || 0,
            courseCount: courseDoc.data().courseCount || 0,
            author_name: authorDoc.data().name || "Unknown Author",
          }));

          allCourses = [...allCourses, ...authorCourses];
        }

        setCourses(allCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };



    fetchAllCourses();
  }, []);


  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
      <section
          className={`courses-area ${style ? "section-py-120" : "section-pt-120 section-pb-90"}`}
          style={{ backgroundImage: `url(/assets/img/bg/courses_bg.jpg )` }}
      >
        <div className="container">
          <div className="section__title-wrap">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="section__title text-center mb-40">
                  <span className="sub-title">Top Class Courses</span>
                  <h2 className="title">Explore Our Best Courses</h2>
                  <p className="desc">
                    Gain skills for today and tomorrow. Start your journey with expert-led courses
                    designed for your success.
                  </p>
                </div>
                <div className="courses__nav">
                  <ul className="nav nav-tabs" id="courseTab" role="tablist">
                    {tab_title.map((tab, index) => (
                        <li
                            key={index}
                            onClick={() => handleTabClick(index)}
                            className="nav-item"
                            role="presentation"
                        >
                          <button
                              className={`nav-link ${activeTab === index ? "active" : ""}`}
                          >
                            {tab}
                          </button>
                        </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="tab-content" id="courseTabContent">
            <div className={`tab-pane fade show active`} id="all-tab-pane" role="tabpanel" aria-labelledby="all-tab">
              <Swiper {...setting} modules={[Autoplay, Navigation]} className="swiper courses-swiper-active">
                {courses.map((course) => (
                    <SwiperSlide key={course.id} className="swiper-slide">
                      <div className="courses__item shine__animate-item">
                        <div className="courses__item-thumb">
                          <Link to={`/course-details/${course.id.split(".")[0]}/${course.id.split(".")[1]}`} className="shine__animate-link">
                            <img src={course.image_url} alt={course.course_name} />
                          </Link>
                        </div>
                        <div className="courses__item-content">
                          <ul className="courses__item-meta list-wrap">
                            <li className="courses__item-tag">
                              <Link to="/courses">{course.department}</Link>
                            </li>
                            <li className="avg-rating">
                              <i className="fas fa-star"></i> {course.rating}
                            </li>
                          </ul>
                          <h5 className="title">
                            <Link to={`/course-details/${course.id.split(".")[0]}/${course.id.split(".")[1]}`}>{course.course_name}</Link>
                          </h5>
                          <p className="author">
                            By <Link
                              to={`/instructor-details/${course.id.split(".")[0]}`}>
                                {course.author_name}
                          </Link>
                          </p>
                          <div className="courses__item-bottom">
                            <div className="button">
                              <Link to={`/course-details/${course.id.split(".")[0]}/${course.id.split(".")[1]}`}>
                                <span className="text">More details</span>
                                <i className="flaticon-arrow-right"></i>
                              </Link>
                            </div>
                            <h5 className="price">Free</h5>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                ))}
              </Swiper>
              {!style && (
                  <div className="courses__nav">
                    <div className="courses-button-prev">
                      <i className="flaticon-arrow-right"></i>
                    </div>
                    <div className="courses-button-next">
                      <i className="flaticon-arrow-right"></i>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </section>
  );
};

// Slider settings
const setting = {
  slidesPerView: 3,

  loop: true, // Yeterli slayt varsa döngü modunu etkinleştir
  spaceBetween: 30,
  observer: true,
  observeParents: true,
  autoplay: false,
  navigation: {
    nextEl: ".courses-button-next",
    prevEl: ".courses-button-prev",
  },
  breakpoints: {
    1500: { slidesPerView: 3 },
    1200: { slidesPerView: 3 },
    992: { slidesPerView: 2, spaceBetween: 24 },
    768: { slidesPerView: 2, spaceBetween: 24 },
    576: { slidesPerView: 1 },
    0: { slidesPerView: 1 },
  },
};


export default CourseArea;
