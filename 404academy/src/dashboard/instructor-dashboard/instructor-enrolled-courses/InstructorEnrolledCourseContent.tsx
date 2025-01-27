"use client"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import {useAuth} from "../../../firebase/AuthContext.tsx";
import axios from "axios";
import {Mosaic} from "react-loading-indicators";

const enrolled_courses: string[] = ["Enrolled Courses", "Completed Courses",];
const my_courses: string[] = ["Publish", "Pendig", "Draft",];

const setting = {
   slidesPerView: 2,
   spaceBetween: 30,
   observer: true,
   observeParents: true,
   loop: true,
   breakpoints: {
      '1500': {
         slidesPerView: 3,
      },
      '1200': {
         slidesPerView: 3,
      },
      '992': {
         slidesPerView: 2,
         spaceBetween: 24,
      },
      '768': {
         slidesPerView: 2,
         spaceBetween: 24,
      },
      '576': {
         slidesPerView: 1.5,
      },
      '0': {
         slidesPerView: 1,
      },
   },
}


// Tüm kursların temel bilgilerini (ID, vb.) çeken fonksiyon
const fetchAllCourses = async () => {
   try {
      const response = await axios.get(
          "http://165.232.76.61:5001/api/Courses/getall"
      );
      // API'dan dönen veride 'data' altında listelenmiş olduğunu varsayıyoruz
      return response.data.data || [];
   } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
   }
};


// Her bir kursun detaylarını (isim, fiyat, yazar vb.) çeken fonksiyon
const fetchCourseById = async (courseId: number) => {
   try {
      const response = await axios.get(
          `http://165.232.76.61:5001/api/Courses/getbyid?id=${courseId}`
      );
      // getbyid endpoint'inin "data.data" içinde döndüğünü varsayıyoruz
      return response.data.data;
   } catch (error) {
      console.error(`Error fetching course details for ID ${courseId}:`, error);
      return null;
   }
};

// Kursa kayıtlı öğrencileri çeken fonksiyon
const fetchEnrolledStudents = async (courseId: number) => {
   try {
      const response = await axios.get(
          `http://165.232.76.61:5001/api/StudentCourses/getstudentsbycourse?courseId=${courseId}`
      );
      return response.data || [];
   } catch (error) {
      console.error(`Error fetching students for course ${courseId}:`, error);
      return [];
   }
};



// Function to format duration from seconds to "Xh Ym" format
const formatDuration = (totalSeconds: number) => {
   const hours = Math.floor(totalSeconds / 3600);
   const minutes = Math.floor((totalSeconds % 3600) / 60);

   let durationString = "";
   if (hours > 0) {
      durationString += `${hours}h `;
   }
   if (minutes > 0 || hours === 0) {
      durationString += `${minutes}m`;
   }
   return durationString.trim();
};

// 4) Author(Yazar) bilgisini çeken fonksiyon
const fetchAuthorById = async (authorId: number) => {
   try {
      const response = await axios.get(
          `http://165.232.76.61:5001/api/Authors/getbyid/${authorId}`
      );
      // getbyid’in "data" içinde döndüğünü varsayıyoruz
      return response.data;
   } catch (error) {
      console.error(`Error fetching author details for ID ${authorId}:`, error);
      return null;
   }
};

// 5) Category(Kategori) bilgisini çeken fonksiyon
const fetchCategoryById = async (categoryId: number) => {
   try {
      const response = await axios.get(
          `http://165.232.76.61:5001/api/Categories/getbyid/${categoryId}`
      );
      // Kategori bilgisi "response.data" içinde dönüyorsa
      return response.data;
   } catch (error) {
      console.error(`Error fetching category details for ID ${categoryId}:`, error);
      return null;
   }
};


const fetchSectionsAndVideos = async (courseId: number) => {
   try {
      const sectionsResponse = await axios.get(
          `http://165.232.76.61:5001/api/Sections/course/${courseId}`
      );
      const sections = sectionsResponse.data;

      let totalDurationInSeconds = 0;
      let totalVideosCount = 0;
      let totalQuizzesCount = 0;

      await Promise.all(
          sections.map(async (section: any) => {
             const videosResponse = await axios.get(
                 `http://165.232.76.61:5001/api/Videos/section/${section.sectionID}`
             );
             const videos = videosResponse.data;

             totalVideosCount += videos.length;
             totalDurationInSeconds += videos.reduce(
                 (sum: number, video: any) => sum + video.duration,
                 0
             );

             const quizzesResponse = await axios.get(
                 `http://165.232.76.61:5001/api/Quiz/list-by-section/${section.sectionID}`
             );
             const quizzes = quizzesResponse.data;
             totalQuizzesCount += quizzes.length;
          })
      );

      return {
         totalDurationInSeconds,
         totalVideosCount,
         totalQuizzesCount,
      };
   } catch (error) {
      console.error("Error fetching sections or videos:", error);
      return {
         totalDurationInSeconds: 0,
         totalVideosCount: 0,
         totalQuizzesCount: 0,
      };
   }
};

const InstructorEnrolledCourseContent = ({ style }: any) => {

   const [courses, setCourses] = useState<any[]>([]);
   const { user } = useAuth();
   const [loading, setLoading] = useState(true);
   const [activeTab, setActiveTab] = useState(0);
   const [isLoop, setIsLoop] = useState(false);


   useEffect(() => {
      setIsLoop(true);
   }, []);

   useEffect(() => {
      const fetchEnrolledCourses = async () => {
         setLoading(true);
         try {
            // 1. Tüm kursların temel bilgilerini çek
            const allCourses = await fetchAllCourses();
            const userEnrolledCourses: any[] = [];

            // 2. Her kurs için (ID bazında) öğrencileri ve detayları çek
            for (const course of allCourses) {
               // Kurs ID'si
               const courseId = course.courseID;
               const enrolledStudents = await fetchEnrolledStudents(courseId);

               // Kullanıcının bu kursa kayıtlı olup olmadığını kontrol et
               const isUserEnrolled = enrolledStudents.some(
                   (student: any) => student.userId === user?.id
               );

               if (isUserEnrolled) {
                  // 3. Kursun detaylarını getById ile çek
                  const courseDetails = await fetchCourseById(courseId);
                  if (courseDetails) {
                     // 4. Author bilgisini (authorId üzerinden) çek
                     const authorInfo = await fetchAuthorById(courseDetails.authorId);

                     // 5. Category bilgisini (categoryId üzerinden) çek
                     const categoryInfo = await fetchCategoryById(
                         courseDetails.categoryId
                     );

                     // 6. Toplam video süresi, ders (video) ve quiz sayısını çek
                     const {
                        totalDurationInSeconds,
                        totalVideosCount,
                        totalQuizzesCount,
                     } = await fetchSectionsAndVideos(courseId);

                     // Yazar bilgisi
                     const authorName = authorInfo ? authorInfo.name : "Unknown Author";
                     const authorImage = authorInfo
                         ? authorInfo.imageURL
                         : "https://via.placeholder.com/100";

                     // Kategori bilgisi
                     const categoryName = categoryInfo
                         ? categoryInfo.name
                         : `Category ${courseDetails.categoryId}`;

                     // Toplam süreyi "Xh Ym" formatına çevirebilirsiniz
                     const durationFormatted = formatDuration(totalDurationInSeconds);

                     // userEnrolledCourses dizisine pushla
                     userEnrolledCourses.push({
                        enrolledCourseId: courseId, // Enrollment ID veya yoksa courseId
                        courseId: courseDetails.courseID,
                        authorId: courseDetails.authorId,
                        courseData: {
                           name: courseDetails.name,
                           department: categoryName,
                           image_url: courseDetails.image,
                           price: courseDetails.price,
                           old_price: courseDetails.discount,
                           rating: courseDetails.rating,
                        },
                        authorData: {
                           name: authorName,
                           image_url: authorImage,
                        },
                        // Toplam video(lesson), toplam quiz, toplam süre
                        totalLessons: totalVideosCount + totalQuizzesCount,
                        totalDuration: durationFormatted, // "Xh Xm" biçiminde
                        completed: false, // kullanıcı tamamladı mı, varsa DB'den
                     });
                  }
               }
            }
            setCourses(userEnrolledCourses);
         }
         catch (error) {
            console.error("Error fetching enrolled courses:", error);
            setCourses([]);
         } finally {
            setLoading(false);
         }
      };

      if (user?.studentId) {
         fetchEnrolledCourses();
      }
   }, [user?.studentId]);


   const handleTabClick = (index: number) => {
      setActiveTab(index);
   };


   const tab_title = style ? my_courses : enrolled_courses;

   const filteredCourses = courses.filter((course) => {
      if (activeTab === 0) {
         // All Courses
         return true;
      } else if (activeTab === 1) {
         // Active Courses (Not completed)
         return course.completed;
      }
      return true;
   });


   return (
       <div className="col-lg-9">
          <div className="dashboard__content-wrap dashboard__content-wrap-two">
             <div className="dashboard__content-title">
                <h4 className="title">
                   {style ? "My Courses" : "Enrolled Courses"}
                </h4>
             </div>
             <div className="row">
                <div className="col-12">
                   <div className="dashboard__nav-wrap mb-40">
                      <ul className="nav nav-tabs" id="courseTab" role="tablist">
                         {tab_title.map((tab, index) => (
                             <li
                                 key={index}
                                 onClick={() => handleTabClick(index)}
                                 className="nav-item"
                                 role="presentation"
                             >
                                <button
                                    className={`nav-link ${
                                        activeTab === index ? "active" : ""
                                    }`}
                                >
                                   {tab}
                                </button>
                             </li>
                         ))}
                      </ul>
                   </div>
                   <div className="tab-content" id="courseTabContent">
                      <div
                          className={`tab-pane fade show active`}
                          id="design-tab-pane"
                          role="tabpanel"
                          aria-labelledby="design-tab"
                      >
                         <Swiper
                             {...setting}
                             modules={[Navigation]}
                             loop={isLoop}
                             className="swiper dashboard-courses-active"
                         >
                            {loading ? (
                                    // Loading durumunda göstereceğimiz özel ekran:
                                    <div
                                        style={{
                                           display: "flex",
                                           justifyContent: "center",
                                           alignItems: "center",
                                           height: "100vh",
                                           backgroundColor: "#f9f9f9",
                                        }}
                                    >
                                       {/* Mosaic bileşenini import etmiş olmanız gerekiyor. */}
                                       {/* Örn: import { Mosaic } from "react-awesome-spinners"; */}
                                       <Mosaic color={["#33CCCC", "#33CC36", "#B8CC33", "#FCCA00"]} />
                                    </div>
                                ) :
                               filteredCourses.length > 0 ?  (
                                filteredCourses.map((course) => {
                                   const { courseData, authorData } = course;
                                   return (
                                       <SwiperSlide
                                           key={course.enrolledCourseId}
                                           className="swiper-slide"
                                       >
                                          <div className="courses__item courses__item-two shine__animate-item">
                                             <div className="courses__item-thumb courses__item-thumb-two">
                                                <Link
                                                    to={`/lesson/${course.courseId}`}
                                                    className="shine__animate-link"
                                                >
                                                   <img
                                                       src={
                                                           courseData?.image_url ||
                                                           "https://via.placeholder.com/300"
                                                       }
                                                       alt="Course Thumbnail"
                                                   />
                                                </Link>
                                             </div>
                                             <div className="courses__item-content courses__item-content-two">
                                                <ul className="courses__item-meta list-wrap">
                                                   <li className="courses__item-tag">
                                                      <Link to={`/lesson/${course.courseId}`}>
                                                         {courseData?.department  || "General"}
                                                      </Link>
                                                   </li>
                                                   {/*{courseData?.price && (
                                                       <li className="price">
                                                          ${courseData.price}
                                                          {courseData.old_price && (
                                                              <del>
                                                                 ${(courseData.old_price + courseData.price).toFixed(2)}
                                                              </del>
                                                          )}

                                                       </li>
                                                   )}*/}
                                                </ul>
                                                <h5 className="title">
                                                   <Link
                                                       to={`/lesson/${course.courseId}`}
                                                   >
                                                      {courseData?.name || "Course Title"}
                                                   </Link>
                                                </h5>
                                                <div className="courses__item-content-bottom">
                                                   <div className="author-two">
                                                      <Link
                                                          to={`/instructor-details/${course.authorId}`}
                                                      >
                                                         <img
                                                             src={
                                                                 authorData?.image_url ||
                                                                 "https://via.placeholder.com/100"
                                                             }
                                                             alt="Instructor"
                                                         />
                                                         {authorData?.name || "Unknown Author"}
                                                      </Link>
                                                   </div>
                                                   <div className="avg-rating">
                                                      <i className="fas fa-star"></i>{" "}
                                                      ({courseData?.rating || "No reviews"} Reviews)
                                                   </div>
                                                </div>
                                                {course.progress && (
                                                    <div className="progress-item progress-item-two">
                                                       <h6 className="title">
                                                          COMPLETE{" "}
                                                          <span>{course.progress}%</span>
                                                       </h6>
                                                       <div className="progress">
                                                          <div
                                                              className="progress-bar"
                                                              style={{
                                                                 width: `${course.progress}%`,
                                                              }}
                                                          ></div>
                                                       </div>
                                                    </div>
                                                )}
                                             </div>
                                             <div className="courses__item-bottom-two">
                                                <ul className="list-wrap">
                                                   <li>
                                                      <i className="flaticon-book"></i>
                                                      {course.totalLessons || 0}
                                                   </li>
                                                   <li>
                                                      <i className="flaticon-clock"></i>
                                                      {course.totalDuration || "0h"}
                                                   </li>
                                                   <li>
                                                      <i className="flaticon-mortarboard"></i>
                                                      {course.completed
                                                          ? "Completed"
                                                          : "Ongoing"}
                                                   </li>
                                                </ul>
                                             </div>
                                          </div>
                                       </SwiperSlide>
                                   );
                                })
                            ) : (
                                <p style={{fontSize: '18px', textAlign: 'center', marginTop: '20px'}}>You have not completed a course yet.</p>
                            )}
                         </Swiper>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
   )
}

export default InstructorEnrolledCourseContent
