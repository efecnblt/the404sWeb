import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import {Link, useParams} from "react-router-dom";
import axios from "axios";

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


interface APICategoryResponse {
   categoryId: number;
   name: string;
   description: string;
}

// API'den dönen "getauthorallprofile" yanıt yapısı
interface APICourseBasic {
   courseID: number;    // Kursun temel ID'si
   name: string;        // Kurs ismi
   description: string; // Kısa açıklama
   rating: number;
   price: number;
   totalStudentCount: number;
}

// API'den dönen yazar (instructor) yapısı
interface APIAuthorResponse {
   authorID: number;
   name: string;
   biography: string;
   departmentID: number;
   rating: number;
   studentCount: number;
   courseCount: number;
   imageURL: string;
   courses: APICourseBasic[];
}

// Kursun "getbyid" ile gelen detaylı yanıtı (response.data.data)
interface APICourseDetail {
   courseID: number;
   name: string;
   categoryId: number;
   description: string;
   authorId: number;
   rating: number;
   ratingCount: number;
   price: number;
   discount: number;
   totalStudentCount: number;
   image: string;
   hashtags: string;
   levelId: number;
}

// Ekranda göstereceğimiz hale dönüştürülmüş "CourseState"
interface CourseState {
   courseID: number;
   name: string;
   description: string;
   rating: number;
   price: number;
   totalStudentCount: number;
   discount?: number;         // İndirim varsa ekleyebilirsiniz
   image?: string;           // Kursun resmi
   authorId?: number;        // Yazarın ID’si
   categoryId?: number;
   categoryName?: string; // <-- Kategori adını buraya ekliyoruz
   ratingCount?: number;
   hashtags?: string;
}

// Instructor bilgilerini tutacağımız state arayüzü
interface InstructorState {
   authorID: number;
   name: string;
   biography: string;
   departmentID: number;
   rating: number;
   imageURL: string;
}


const InstructorSlider: React.FC= () => {
   const { instructorId } = useParams();
   const [instructor, setInstructor] = useState<InstructorState | null>(null);
   const [courses, setCourses] = useState<CourseState[]>([]);

   const [isLoop, setIsLoop] = useState(false);


   const [loading, setLoading] = useState(true);    // <--- Loading state
   const [error, setError] = useState<string | null>(null); // <--- Error state

   useEffect(() => {
      if (courses.length >= 3) {
         setIsLoop(true);
      }
   }, []);

   useEffect(() => {
      const fetchAuthorAndCourses = async () => {
         if (!instructorId) {
            setError("Author ID is missing in URL.");
            setLoading(false);
            return;
         }
         try {
            setLoading(true);
            setError(null);

            // --- A) Yazar ve temel kurs bilgilerini çek
            const response = await axios.get<APIAuthorResponse>(
                `http://165.232.76.61:5001/api/Authors/getauthorallprofile?authorId=${instructorId}`
            );
            const data = response.data;

            // Instructor state’e yazar bilgilerini at
            setInstructor({
               authorID: data.authorID,
               name: data.name,
               biography: data.biography,
               departmentID: data.departmentID,
               rating: data.rating,
               imageURL: data.imageURL,
            });

            // --- B) Her kursun detaylarını ek API ile al
            // data.courses -> APICourseBasic dizisi
            const expandedCourses: CourseState[] = [];

            // Bir Promise array’ine mapleyerek hepsini parallel çekebiliriz
            // (her kurs için getbyid) ve bekliyoruz.
            await Promise.all(
                data.courses.map(async (c) => {
                   try {
                      const detailResp = await axios.get<{
                         data: APICourseDetail;
                         success: boolean;
                         message?: string;
                      }>(
                          `http://165.232.76.61:5001/api/Courses/getbyid?id=${c.courseID}`
                      );
                      const detail = detailResp.data.data; // Gerçek kurs detayı
                      // detail.image, detail.price, detail.rating vb.

                      // b) Kategori adı
                      let categoryName: string | undefined = undefined;
                      if (detail.categoryId) {
                         const categoryResp = await axios.get<APICategoryResponse>(
                             `http://165.232.76.61:5001/api/Categories/getbyid/${detail.categoryId}`
                         );
                         categoryName = categoryResp.data.name;
                      }

                      // State’e uygun biçimde dönüştür
                      expandedCourses.push({
                         courseID: detail.courseID,
                         name: detail.name,
                         description: detail.description,
                         rating: detail.rating,
                         price: detail.price,
                         discount: detail.discount,
                         totalStudentCount: detail.totalStudentCount,
                         image: detail.image,
                         authorId: detail.authorId,
                         categoryId: detail.categoryId,
                         categoryName: categoryName, // <-- Kategori adını ekledik
                         ratingCount: detail.ratingCount,
                         hashtags: detail.hashtags,
                      });
                   } catch (err) {
                      console.error(
                          `Error fetching detail for courseID = ${c.courseID}:`,
                          err
                      );
                   }
                })
            );

            setCourses(expandedCourses);
         } catch (err) {
            console.error("Error fetching author profile:", err);
            setError("An error occurred while fetching author/courses data.");
         } finally {
            setLoading(false);
         }
      };

      fetchAuthorAndCourses();
   }, [instructorId]);


   // Loading / Error / No data kontrolleri
   if (loading) {
      return <p style={{ textAlign: "center" }}>Loading courses...</p>;
   }
   if (error) {
      return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
   }
   if (!instructor) {
      return <p style={{ textAlign: "center" }}>Instructor not found.</p>;
   }

   return (
       <>

          <Swiper {...setting} modules={[Navigation]} loop={isLoop} className="swiper courses-swiper-active-two">
             {courses.map((course) => (
                 <SwiperSlide  key={course.courseID}  className="swiper-slide">
                    <div className="courses__item shine__animate-item">
                       <div className="courses__item-thumb">
                          <Link to={`/course-details/${course.authorId}/${course.courseID}`} className="shine__animate-link">
                             <img src={course.image || "/default-course.png"} alt={course.name} />
                          </Link>
                       </div>
                       <div className="courses__item-content">
                          <ul className="courses__item-meta list-wrap">
                             <li className="courses__item-tag">
                                <Link to={`/courses`}>{course.categoryName}</Link>
                             </li>
                             <li className="avg-rating"><i className="fas fa-star"></i>{course.rating}</li>
                          </ul>
                          <h5 className="title"><Link to={`/course-details/${course.authorId}/${course.courseID}`}>{course.name}</Link></h5>
                          <p className="author">By <Link to={`/instructor-details/${instructor.authorID}`}>{instructor.name}</Link></p>
                          <div className="courses__item-bottom">
                             <div className="button">
                                <Link to={`/course-details/${instructor.authorID}/${course.courseID}`}>
                                   <span className="text">More Details</span>
                                   <i className="flaticon-arrow-right"></i>
                                </Link>
                             </div>
                             <h5 className="price">${course.price} <del>${(course.price + course.discount).toFixed(2)}</del></h5>
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
