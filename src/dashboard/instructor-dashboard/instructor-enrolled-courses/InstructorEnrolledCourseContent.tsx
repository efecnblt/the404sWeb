"use client"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import {useAuth} from "../../../firebase/AuthContext.tsx";
import {collection, doc, getDoc, getDocs} from "firebase/firestore";
import {db} from "../../../firebase/firebaseConfig.ts";

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


// Function to fetch enrolled courses and their details, including sections and videos
const fetchEnrolledCoursesWithDetails = async (userId: string) => {
   try {
      const userCoursesRef = collection(db, `users/${userId}/enrolledCourses`);
      const coursesSnapshot = await getDocs(userCoursesRef);

      const enrolledCourses = [];

      for (const docSnap of coursesSnapshot.docs) {
         const enrolledCourseData = docSnap.data();
         const { courseId, authorId } = enrolledCourseData;

         // Fetch course details
         const courseDocRef = doc(
             db,
             `authors/${authorId}/courses/${courseId}`
         );
         const courseDoc = await getDoc(courseDocRef);
         const courseData = courseDoc.exists() ? courseDoc.data() : null;

         // Fetch author details
         const authorDocRef = doc(db, `authors/${authorId}`);
         const authorDoc = await getDoc(authorDocRef);
         const authorData = authorDoc.exists() ? authorDoc.data() : null;

         // Initialize total lessons and total duration
         let totalLessons = 0;
         let totalDurationInSeconds = 0;

         // Fetch sections and videos
         const sectionsRef = collection(
             db,
             `authors/${authorId}/courses/${courseId}/sections`
         );
         const sectionsSnapshot = await getDocs(sectionsRef);

         for (const sectionDoc of sectionsSnapshot.docs) {
            const sectionData = sectionDoc.data();
            const sectionId = sectionDoc.id;

            // Fetch videos in the section
            const videosRef = collection(
                db,
                `authors/${authorId}/courses/${courseId}/sections/${sectionId}/videos`
            );
            const videosSnapshot = await getDocs(videosRef);

            totalLessons += videosSnapshot.size;

            // Sum up durations
            for (const videoDoc of videosSnapshot.docs) {
               const videoData = videoDoc.data();
               const duration = videoData.duration || 0; // Assuming duration is in seconds
               totalDurationInSeconds += duration;
            }
         }

         // Convert total duration to a readable format (e.g., "2h 30m")
         const totalDuration = formatDuration(totalDurationInSeconds);

         enrolledCourses.push({
            id: docSnap.id,
            enrolledCourseId: docSnap.id,
            courseId,
            authorId,
            courseData,
            authorData,
            totalLessons,
            totalDuration,
            ...enrolledCourseData,
         });
      }

      console.log("Enrolled Courses with Details:", enrolledCourses);
      return enrolledCourses;
   } catch (error) {
      console.error("Error fetching enrolled courses with details:", error);
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



const InstructorEnrolledCourseContent = ({ style }: any) => {

   const [courses, setCourses] = useState<any[]>([]);
   const { user } = useAuth();

   useEffect(() => {
      const getCourses = async () => {
         if (user?.id) {
            const enrolledCourses = await fetchEnrolledCoursesWithDetails(user.id);
            setCourses(enrolledCourses || []);
         }
      };

      getCourses();
   }, [user?.id]);


   const [activeTab, setActiveTab] = useState(0);

   const handleTabClick = (index: number) => {
      setActiveTab(index);
   };

   const [isLoop, setIsLoop] = useState(false);
   useEffect(() => {
      setIsLoop(true);
   }, []);

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
                            {filteredCourses.length > 0 ?  (
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
                                                    to={`/course-details/${course.authorId}/${course.courseId}`}
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
                                                      <Link to={`/course`}>
                                                         {courseData?.department || "General"}
                                                      </Link>
                                                   </li>
                                                   {courseData?.price && (
                                                       <li className="price">
                                                          {courseData.old_price && (
                                                              <del>
                                                                 ${courseData.old_price}
                                                              </del>
                                                          )}
                                                          ${courseData.price}
                                                       </li>
                                                   )}
                                                </ul>
                                                <h5 className="title">
                                                   <Link
                                                       to={`/course-details/${course.authorId}/${course.courseId}`}
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
