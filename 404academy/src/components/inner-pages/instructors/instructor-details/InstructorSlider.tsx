import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Link } from "react-router-dom";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";

const setting = {
   slidesPerView: 3 ,
   spaceBetween: 30,
   observer: true,
   observeParents: true,
   loop: true,
   breakpoints: {
      '1500': { slidesPerView: 3 },
      '1200': { slidesPerView: 3 },
      '992': { slidesPerView: 3, spaceBetween: 24 },
      '768': { slidesPerView: 2, spaceBetween: 24 },
      '576': { slidesPerView: 1 },
      '0': { slidesPerView: 1 },
   },
   navigation: {
      nextEl: ".courses-button-next",
      prevEl: ".courses-button-prev",
   },
};

interface Course {
   id: string;
   course_name: string;
   image_url: string;
   department: string;
   rating: number;
   author_name: string;
}

interface Instructor {
   instructorId?: string;
   name: string;
   bio?: string;
   image_url?: string;
}

const InstructorSlider: React.FC<Instructor> = ({ instructorId }) =>{
   const [courses, setCourses] = useState<Course[]>([]);
   const [instructor, setInstructor] = useState<{ name: string; bio?: string; image_url?: string } | null>(null);
   const [isLoop, setIsLoop] = useState(false);

   useEffect(() => {
      setIsLoop(true);
   }, []);

   useEffect(() => {
      const fetchInstructorDetails = async () => {
         try {
            const instructorDoc = await getDoc(doc(db, "authors", instructorId));
            if (instructorDoc.exists()) {
               setInstructor(instructorDoc.data() as { name: string; bio?: string; image_url?: string });
            } else {
               console.error("Instructor not found.");
            }
         } catch (error) {
            console.error("Error fetching instructor details:", error);
         }
      };

      const fetchCourses = async () => {
         try {
            const coursesSnapshot = await getDocs(collection(db, `authors/${instructorId}/courses`));
            const coursesData = coursesSnapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            })) as Course[];
            setCourses(coursesData);
         } catch (error) {
            console.error("Error fetching courses:", error);
         }
      };

      fetchInstructorDetails();
      fetchCourses();
   }, [instructorId]);


   return (
       <>
          {/*{instructor && (
              <div className="instructor-header">
                 <img src={instructor.image_url || "/default-avatar.png"} alt={instructor.name} style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ccc",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                 }}/>
                 <h2>{instructor.name}</h2>
                 {instructor.description && <p>{instructor.description}</p>}
              </div>
          )}*/}

          <Swiper {...setting} modules={[Navigation]} loop={isLoop} className="swiper courses-swiper-active-two">
             {courses.map((course, index) => (
                 <SwiperSlide key={index} className="swiper-slide">
                    <div className="courses__item shine__animate-item">
                       <div className="courses__item-thumb">
                          <Link to={`/course-details/${course.id}`} className="shine__animate-link">
                             <img src={course.image_url || "/default-course.png"} alt={course.course_name} />
                          </Link>
                       </div>
                       <div className="courses__item-content">
                          <ul className="courses__item-meta list-wrap">
                             <li className="courses__item-tag">
                                <Link to={`/course/${course.department}`}>{course.department}</Link>
                             </li>
                             <li className="avg-rating"><i className="fas fa-star"></i>{course.rating}</li>
                          </ul>
                          <h5 className="title"><Link to={`/course-details/${course.id}`}>{course.course_name}</Link></h5>
                          <p className="author">By <Link to={`/instructor-details/${instructorId}`}>{instructor.name}</Link></p>
                          <div className="courses__item-bottom">
                             <div className="button">
                                <Link to={`/course-details/${instructorId}/${course.id}`}>
                                   <span className="text">Start Course</span>
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
       </>
   );
}

export default InstructorSlider;
