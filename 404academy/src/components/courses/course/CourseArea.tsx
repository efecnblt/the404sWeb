import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import CourseSidebar from './CourseSidebar';
import CourseTop from './CourseTop';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getDiscountedPrice } from "../../../modals/DiscountPrice.ts";
import {Mosaic} from "react-loading-indicators";

const CourseArea = () => {
   const [courses, setCourses] = useState<any[]>([]);
   const [filteredCourses, setFilteredCourses] = useState<any[]>([]);

   const [categories, setCategories] = useState<any[]>([]);   // <-- KATEGORİLERİ TUTACAĞIMIZ STATE
   const [loading, setLoading] = useState(true);

   const itemsPerPage = 12;
   const [itemOffset, setItemOffset] = useState(0);


   // Price ranges
   const priceOptions = [
      { label: "Under $10", min: 0, max: 10 },
      { label: "$10 - $20", min: 10, max: 20 },
      { label: "$20 - $40", min: 20, max: 40 },
      { label: "Above $40", min: 40, max: Infinity },
   ];

   // Filtre state'leri
   // Kategori seçimini ID bazlı tutuyoruz. 0 → Hepsi
   const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

   const [priceSelected, setPriceSelected] = useState('');
   const [skillSelected, setSkillSelected] = useState<number | null>(null);
   const [instructorSelected, setInstructorSelected] = useState('');
   const [ratingSelected, setRatingSelected] = useState<number | null>(null);
   const [selected, setSelected] = useState<string>(''); // Sıralama türü için state


   const endOffset = itemOffset + itemsPerPage;
   const [activeTab, setActiveTab] = useState(0);

   // Sayfalama için hesaplanan değerler
   const currentItems = filteredCourses.slice(itemOffset, endOffset);
   const pageCount = Math.ceil(filteredCourses.length / itemsPerPage);
   const startOffset = itemOffset + 1;
   const totalItems = filteredCourses.length;

   // Sayfa değiştirme
   const handlePageClick = (event: { selected: number }) => {
      const newOffset = (event.selected * itemsPerPage) % filteredCourses.length;
      setItemOffset(newOffset);
   };

   const handleTabClick = (index: number) => {
      setActiveTab(index);
   };

   // --- KATEGORİLERİ ÇEKME FONKSİYONU ---
   const fetchCategories = async () => {
      try {
         // Örn: GET http://165.232.76.61:5000/api/Categories/getall
         const response = await axios.get("http://165.232.76.61:5001/api/Categories/getall");
         // Beklenen veri: [ { categoryId: 1, name: "Cyber Security", ... }, ... ]
         setCategories(response.data || []);
      } catch (error) {
         console.error("Error fetching categories:", error);
      }
   };

   // Kursları + Yazar bilgilerini çekme
   const fetchAllCoursesWithAuthors = async () => {
      try {
         // 1) Tüm kursları çek
         const coursesResponse = await axios.get('http://165.232.76.61:5001/api/Courses/getall');
         const coursesData = Array.isArray(coursesResponse.data)
             ? coursesResponse.data
             : coursesResponse.data.data; // Diziye erişim

         // 2) Departman bilgilerini çek
         const departmentsResponse = await axios.get('http://165.232.76.61:5001/api/Departments');
         const departments = departmentsResponse.data;

         // 3) Tüm kurslar için ilgili author bilgilerini çek
         const coursesWithAuthors = await Promise.all(
             coursesData.map(async (course: any) => {
                try {
                   const authorResponse = await axios.get(
                       `http://165.232.76.61:5001/api/Authors/getbyid/${course.authorId}`
                   );
                   const author = authorResponse.data;

                   // Yazarın departman bilgisini bul
                   const department = departments.find(
                       (dept: any) => dept.departmentID === author.departmentID
                   );

                   // Kurs nesnesine eklenmesi
                   return {
                      ...course,
                      authorName: author.name,
                      authorImage: author.imageURL,
                      authorDepartmentID: author.departmentID,
                      authorRating: author.rating,
                      authorStudentCount: author.studentCount,
                      departmentName: department ? department.departmentName : "Unknown Department",
                   };
                } catch (error) {
                   console.error(`Error fetching author for courseID: ${course.courseID}`, error);
                   return {
                      ...course,
                      authorId: course.authorID,
                      authorName: "Unknown Author",
                      departmentName: "Unknown Department",
                   };
                }
             })
         );

         // 4) Karıştırma işlemi
         for (let i = coursesWithAuthors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [coursesWithAuthors[i], coursesWithAuthors[j]] = [coursesWithAuthors[j], coursesWithAuthors[i]];
         }
         return coursesWithAuthors;
      } catch (error) {
         console.error("Error fetching courses and authors:", error);
         throw error;
      }
   };

   // Tüm data çekilirken hem kategorileri hem kursları paralel çekebiliriz
   useEffect(() => {
      const fetchData = async () => {
         try {
            // 1) Kategorileri çek
            await fetchCategories();
            // 2) Kursları (author'larla birlikte) çek
            const data = await fetchAllCoursesWithAuthors();
            setCourses(data);
            setFilteredCourses(data); // Başlangıçta tüm kursları göster
         } catch (error) {
            console.error(error);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, []);


   // --- Filtreleme mantığı ---
   const applyFilters = () => {
      let updatedCourses = [...courses];

      // Kategori ID filtresi
      // 0 => "All Category", dolayısıyla 0 değilse filtrele
      if (selectedCategoryId !== 0) {
         updatedCourses = updatedCourses.filter(course =>  course.categoryId === selectedCategoryId);

      }


      // Apply Price Filter
      if (priceSelected) {
         const selectedPriceOption = priceOptions.find(
             (option) => option.label === priceSelected
         );
         if (selectedPriceOption) {
            updatedCourses = updatedCourses.filter(
                (course) =>
                    course.price >= selectedPriceOption.min &&
                    course.price <= selectedPriceOption.max
            );
         }
      }

      // Filter by skill level
      if (skillSelected !== null) {
         updatedCourses = updatedCourses.filter((course) => course.levelId === skillSelected);
      }

      // Eğitmen filtresi
      if (instructorSelected) {
         // "course.authorName" ya da "course.instructorName"
         updatedCourses = updatedCourses.filter(course => course.authorName === instructorSelected);
      }

      // Rating filtresi
      if (ratingSelected !== null) {
         updatedCourses = updatedCourses.filter(
             course => Math.floor(course.rating) >= ratingSelected
         );
      }
      switch (selected) {
         case 'popular':
            updatedCourses.sort((a, b) => b.authorRating - a.authorRating); // Eğitmen rating'ine göre
            break;
         case 'price-asc':
            updatedCourses.sort((a, b) => a.price - b.price); // Artan fiyat
            break;
         case 'price-desc':
            updatedCourses.sort((a, b) => b.price - a.price); // Azalan fiyat
            break;
         case 'rating':
            updatedCourses.sort((a, b) => b.rating - a.rating); // Kurs rating
            break;
         case 'students':
            updatedCourses.sort((a, b) => b.authorStudentCount - a.authorStudentCount); // Öğrenci sayısı
            break;
         default:
            break;
      }


      setFilteredCourses(updatedCourses);
      setItemOffset(0); // Sayfayı başa döndür


   };

   // Herhangi bir filtre state'i ya da "courses" değiştiğinde filtre tekrar uygulansın
   useEffect(() => {
      applyFilters();
   }, [
      selectedCategoryId,
      priceSelected,
      skillSelected,
      instructorSelected,
      ratingSelected,
      selected,
      courses
   ]);

   if (loading) {
      return (
          <div
              style={{
                 display: "flex",
                 justifyContent: "center",
                 alignItems: "center",
                 height: "100vh",
                 backgroundColor: "#f9f9f9",
              }}
          >
             <Mosaic color={["#33CCCC", "#33CC36", "#B8CC33", "#FCCA00"]} />
          </div>
      );
   }




   return (
       <section className="all-courses-area section-py-120">
          <div className="container">
             <div className="row">
                {/*
             CourseSidebar'a "categories" ve "categorySelectedId" state'lerini,
             setCategorySelectedId fonksiyonunu da gönderiyoruz.
           */}
                <CourseSidebar
                    // Kategori ID bazlı filtre state
                    selectedCategoryId={selectedCategoryId}
                    setSelectedCategoryId={setSelectedCategoryId}

                    priceSelected={priceSelected}
                    setPriceSelected={setPriceSelected}
                    skillSelected={skillSelected}
                    setSkillSelected={setSkillSelected}
                    instructorSelected={instructorSelected}
                    setInstructorSelected={setInstructorSelected}
                    ratingSelected={ratingSelected}
                    setRatingSelected={setRatingSelected}

                    // Kurslar ve kategoriler
                    courses={courses}
                    categories={categories}
                />

                <div className="col-xl-9 col-lg-8">
                   <CourseTop
                       startOffset={startOffset}
                       endOffset={Math.min(endOffset, totalItems)}
                       totalItems={totalItems}
                       setCourses={setCourses}
                       handleTabClick={handleTabClick}
                       activeTab={activeTab}
                       setSelected={setSelected} // Seçim fonksiyonunu gönder
                   />

                   <div className="tab-content" id="myTabContent">
                      {/* GRID TAB */}
                      <div
                          className={`tab-pane fade ${activeTab === 0 ? 'show active' : ''}`}
                          id="grid"
                          role="tabpanel"
                          aria-labelledby="grid-tab"
                      >
                         <div className="row courses__grid-wrap row-cols-1 row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-sm-1">
                            {currentItems.map((item) => (
                                <div key={item.courseID}>
                                   <div className="courses__item shine__animate-item">
                                      <div className="courses__item-thumb">
                                         <Link
                                             to={`/course-details/${item.authorId}/${item.courseID}`}
                                             className="shine__animate-link"
                                         >
                                            <img src={item.image} alt="img" />
                                         </Link>
                                      </div>
                                      <div className="courses__item-content">
                                         <ul className="courses__item-meta list-wrap">
                                            <li className="courses__item-tag">
                                               <Link to="/courses">{item.departmentName}</Link>
                                            </li>
                                            <li className="avg-rating">
                                               <i className="fas fa-star"></i> ({item.rating} Reviews)
                                            </li>
                                         </ul>
                                         <h5 className="title">
                                            <Link to={`/course-details/${item.authorId}/${item.courseID}`}>
                                               {item.name}
                                            </Link>
                                         </h5>
                                         <p className="author">
                                            By <Link to={`/instructor-details/${item.authorId}`}>{item.authorName}</Link>
                                         </p>
                                         <div className="courses__item-bottom">
                                            <div className="button">
                                               <Link to={`/course-details/${item.authorId}/${item.courseID}`}>
                                                  <span className="text">More Details</span>
                                                  <i className="flaticon-arrow-right"></i>
                                               </Link>
                                            </div>
                                            <h5 className="price">
                                               ${item.price} <br />
                                               <del>
                                                  ${getDiscountedPrice(item.price, item.discount).toFixed(2)}
                                               </del>
                                            </h5>
                                         </div>
                                      </div>
                                   </div>
                                </div>
                            ))}
                         </div>
                         {/* PAGINATION */}
                         <nav className="pagination__wrap mt-30">
                            <ReactPaginate
                                breakLabel="..."
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                pageCount={pageCount}
                                renderOnZeroPageCount={null}
                                className="list-wrap"
                            />
                         </nav>
                      </div>

                      {/* LIST TAB */}
                      <div
                          className={`tab-pane fade ${activeTab === 1 ? 'show active' : ''}`}
                          id="list"
                          role="tabpanel"
                          aria-labelledby="list-tab"
                      >
                         <div className="row courses__list-wrap row-cols-1">
                            {currentItems.map((item) => (
                                <div key={item.courseID} className="col">
                                   <div className="courses__item courses__item-three shine__animate-item">
                                      <div className="courses__item-thumb">
                                         <Link
                                             to={`/course-details/${item.authorId}/${item.courseID}`}
                                             className="shine__animate-link"
                                         >
                                            <img src={item.image} alt="img" />
                                         </Link>
                                      </div>
                                      <div className="courses__item-content">
                                         <ul className="courses__item-meta list-wrap">
                                            <li className="courses__item-tag">
                                               <Link to="/course">{item.departmentName}</Link>
                                               <div className="avg-rating">
                                                  <i className="fas fa-star"></i> ({item.rating} Reviews)
                                               </div>
                                            </li>
                                            <li className="price">
                                               ${item.price}
                                               <del>${(item.discount + item.price).toFixed(2)}</del>
                                            </li>
                                         </ul>
                                         <h5 className="title">
                                            <Link to={`/course-details/${item.authorId}/${item.courseID}`}>
                                               {item.name}
                                            </Link>
                                         </h5>
                                         <p className="author">
                                            By <Link to={`/instructor-details/${item.authorId}`}>{item.authorName}</Link>
                                         </p>
                                         <p className="info">
                                            {item.description.replace(/\[\d+\]\s*/g, '').slice(0, 180)}{/* İlk 180 karakter */}
                                            {item.description.replace(/\[\d+\]\s*/g, '').length > 180 ? '...' : ''}
                                         </p>
                                         <div className="courses__item-bottom">
                                            <div className="button">
                                               <Link to={`/course-details/${item.authorId}/${item.courseID}`}>
                                                  <span className="text">More Details</span>
                                                  <i className="flaticon-arrow-right"></i>
                                               </Link>
                                            </div>
                                         </div>
                                      </div>
                                   </div>
                                </div>
                            ))}
                         </div>
                         {/* PAGINATION */}
                         <nav className="pagination__wrap mt-30">
                            <ul className="list-wrap">
                               <ReactPaginate
                                   breakLabel="..."
                                   onPageChange={handlePageClick}
                                   pageRangeDisplayed={3}
                                   pageCount={pageCount}
                                   renderOnZeroPageCount={null}
                                   className="list-wrap"
                               />
                            </ul>
                         </nav>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </section>
   );
};

export default CourseArea;
