import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import {Link} from "react-router-dom";

import axios from "axios";
import { Course } from "../../../modals/Course";
import { Author } from "../../../modals/Author";
import { Category } from "../../../modals/Category";
import {getDiscountedPrice} from "../../../modals/DiscountPrice.ts";

const tab_title: string[] = ["All Courses", "Cyber Security", "Ethical Hacking", "Web Security"];



interface CourseAreaProps {
  style: boolean;
}

// Bu arayüz, UI'da kullanacağımız "adapted" kurs yapısını temsil ediyor
// Yani backend'den gelen veriyi UI'ın kolayca kullanabileceği formata dönüştüreceğiz.
interface AdaptedCourse {
  id: string;               // courseID => string'e çevirdik
  authorId: string;         // authorId => string'e çevirdik
  course_name: string;      // orijinalde "name"
  image_url: string;        // orijinalde "image"
  department: string;       // orijinalde category.name
  rating: number;
  price: number;
  discount: number;
  studentCount: number;
  courseCount: number;
  author_name: string;
}


const CourseArea = ({ style }: CourseAreaProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [courses, setCourses] = useState<AdaptedCourse[]>([]);


  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        // Burada dizi döndüğünü belirtiyoruz: axios.get<Course[]>
        const [coursesRes, authorsRes, categoriesRes] = await Promise.all([
          axios.get<Course[]>("http://165.232.76.61:5001/api/Courses/getall"),
          axios.get<Author[]>("http://165.232.76.61:5001/api/Authors/getall"),
          axios.get<Category[]>("http://165.232.76.61:5001/api/Categories/getall")
        ]);
        console.log(coursesRes.data);
        const coursesData = coursesRes.data;   // Course[] türünde
        const authorsData = authorsRes.data;   // Author[] türünde
        const categoriesData = categoriesRes.data; // Category[] türünde

        // Gelen veriyi UI'da kullanmak için dönüştürüyoruz
        const adaptedData = coursesData.data.map((course) =>  {
          const author = authorsData.find((a) => a.authorID === course.authorId);
          const category = categoriesData.find((c) => c.categoryId === course.categoryId);

          return {
            id: course.courseID.toString(),
            authorId: course.authorId.toString(),
            course_name: course.name,
            image_url: course.image || "default-thumb.jpg",
            department: category ? category.name : "General",
            rating: course.rating || 0,
            price: course.price || 0,
            discount: course.discount || 0,
            studentCount: course.totalStudentCount || 0,
            courseCount: author?.courseCount || 0,
            author_name: author?.name || "Unknown Author",
          };
        });

        setCourses(adaptedData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchAllCourses();
  }, []);



  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const filteredCourses = courses.filter((course) => {
    // Tüm kurslar
    if (activeTab === 0) return true;

    return course.department.toLowerCase() === tab_title[activeTab].toLowerCase();
  });


  const sliderSettings = {
    slidesPerView: 3,
    loop: filteredCourses.length > 3, // 3'ten fazla kurs varsa loop olsun
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
              <Swiper {...sliderSettings} modules={[Autoplay, Navigation]} className="swiper courses-swiper-active">
                {filteredCourses.map((course) => (

                    <SwiperSlide key={course.id} className="swiper-slide">
                      <div className="courses__item shine__animate-item">
                        <div className="courses__item-thumb">
                          <Link to={`/course-details/${course.authorId}/${course.id}`} className="shine__animate-link">
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
                            <Link to={`/course-details/${course.authorId}/${course.id}`}> {course.course_name} </Link>
                          </h5>
                          <p className="author">
                            By <Link to={`/instructor-details/${course.authorId}`}>
                                {course.author_name}
                          </Link>
                          </p>
                          <div className="courses__item-bottom">
                            <div className="button">
                              <Link to={`/course-details/${course.authorId}/${course.id}`}>
                                <span className="text">More details</span>
                                <i className="flaticon-arrow-right"></i>
                              </Link>
                            </div>
                            <h5 className="price">${course.price} <del> ${getDiscountedPrice(course.price, course.discount).toFixed(2)}</del> </h5>
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



export default CourseArea;
