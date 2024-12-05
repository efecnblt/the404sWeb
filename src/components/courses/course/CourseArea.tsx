import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import CourseSidebar from './CourseSidebar';
import CourseTop from './CourseTop';
import {Link} from 'react-router-dom';
import {collection, getDocs, getFirestore} from "firebase/firestore";

const CourseArea = () => {

   const [courses, setCourses] = useState<any[]>([]); // Tüm kurslar için
   const [authorsAndCourses, setAuthorsAndCourses] = useState<any[]>([]); // Tüm yazar ve kurs verileri
   const [loading, setLoading] = useState(true); // Yükleme durumu


   const itemsPerPage = 12;
   const [itemOffset, setItemOffset] = useState(0);
   const endOffset = itemOffset + itemsPerPage;
   const currentItems = courses.slice(itemOffset, endOffset);
   const pageCount = Math.ceil(courses.length / itemsPerPage);

   const startOffset = itemOffset + 1;
   const totalItems = courses.length;

   const [activeTab, setActiveTab] = useState(0);

   const handlePageClick = (event: { selected: number }) => {
      const newOffset = (event.selected * itemsPerPage) % courses.length;
      setItemOffset(newOffset);
   };

   const handleTabClick = (index: number) => {
      setActiveTab(index);
   };


   // Tüm yazarları ve kursları çek
   const fetchAllAuthorsAndCourses = async () => {
      try {
         const db = getFirestore();
         const authorsCollectionRef = collection(db, "authors"); // authors koleksiyonuna referans
         const authorsSnapshot = await getDocs(authorsCollectionRef);

         const authorsAndCourses = await Promise.all(
             authorsSnapshot.docs.map(async (authorDoc) => {
                const authorData = { id: authorDoc.id, ...authorDoc.data() };

                // Yazarın courses alt koleksiyonunu çek
                const coursesCollectionRef = collection(db, `authors/${authorDoc.id}/courses`);
                const coursesSnapshot = await getDocs(coursesCollectionRef);
                const coursesData = coursesSnapshot.docs.map((courseDoc) => ({
                   id: courseDoc.id,
                   ...courseDoc.data(),
                }));

                return {
                   author: authorData,
                   courses: coursesData,
                };
             })
         );

         return authorsAndCourses;
      } catch (error) {
         console.error("Error fetching authors and courses:", error);
         throw error;
      }
   };

   // Verileri çek ve state'i güncelle
   useEffect(() => {
      const fetchData = async () => {
         try {
            const data = await fetchAllAuthorsAndCourses();
            setAuthorsAndCourses(data);

            // Tüm kursları düz bir dizi olarak oluştur
            const allCourses = data.flatMap((entry) =>
                entry.courses.map((course: any) => ({
                   ...course,
                   authorName: entry.author.name, // Yazar adını kurs verisine ekle
                   authorId: entry.author.id,
                }))
            );

            setCourses(allCourses); // Kursları güncelle
         } catch (error) {
            console.error(error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);



   return (
      <section className="all-courses-area section-py-120">
         <div className="container">
            <div className="row">
               <CourseSidebar  />
               <div className="col-xl-9 col-lg-8">
                  <CourseTop
                     startOffset={startOffset}
                     endOffset={Math.min(endOffset, totalItems)}
                     totalItems={totalItems}
                     setCourses={setCourses}
                     handleTabClick={handleTabClick}
                     activeTab={activeTab}
                  />
                  <div className="tab-content" id="myTabContent">
                     <div className={`tab-pane fade ${activeTab === 0 ? 'show active' : ''}`} id="grid" role="tabpanel" aria-labelledby="grid-tab">
                        <div className="row courses__grid-wrap row-cols-1 row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-sm-1">
                           {currentItems.map((item) => (
                              <div key={`${item.id}-${item.authorId}`} className="col">
                                 <div className="courses__item shine__animate-item">
                                    <div className="courses__item-thumb">
                                       <Link to={`/course-details/${item.authorId}/${item.id}`} className="shine__animate-link">
                                          <img src={item.image_url} alt="img" />
                                       </Link>
                                    </div>
                                    <div className="courses__item-content">
                                       <ul className="courses__item-meta list-wrap">
                                          <li className="courses__item-tag">
                                             <Link to="/courses">{item.department}</Link>
                                          </li>
                                          <li className="avg-rating"><i className="fas fa-star"></i> ({item.rating} Reviews)</li>
                                       </ul>
                                       <h5 className="title"><Link to={`/course-details/${item.authorId}/${item.id}`}>{item.name}</Link></h5>
                                       <p className="author">By <Link to={`/instructor-details/${item.authorId}`}>{item.authorName}</Link></p>
                                       <div className="courses__item-bottom">
                                          <div className="button">
                                             <Link to={`/course-details/${item.authorId}/${item.id}`}>
                                                <span className="text">More Details</span>
                                                <i className="flaticon-arrow-right"></i>
                                             </Link>
                                          </div>
                                          <h5 className="price">$Free</h5>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
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

                     <div className={`tab-pane fade ${activeTab === 1 ? 'show active' : ''}`} id="list" role="tabpanel" aria-labelledby="list-tab">
                        <div className="row courses__list-wrap row-cols-1">
                           {currentItems.map((item) => (
                              <div key={`${item.id}-${item.authorId}`} className="col">
                                 <div className="courses__item courses__item-three shine__animate-item">
                                    <div className="courses__item-thumb">
                                       <Link to="/course-details" className="shine__animate-link">
                                          <img src={item.thumb} alt="img" />
                                       </Link>
                                    </div>
                                    <div className="courses__item-content">
                                       <ul className="courses__item-meta list-wrap">
                                          <li className="courses__item-tag">
                                             <Link to="/course">{item.department}</Link>
                                             <div className="avg-rating">
                                                <i className="fas fa-star"></i>  ({item.rating} Reviews)
                                             </div>
                                          </li>
                                          <li className="price">${item.price}.00</li>
                                       </ul>
                                       <h5 className="title"><a href="course-details.html">{item.title}</a></h5>
                                       <p className="author">By <a href="#">{item.authorName}</a></p>
                                       <p className="info">{item.description}</p>
                                       <div className="courses__item-bottom">
                                          <div className="button">
                                             <a href="course-details.html">
                                                <span className="text">More Details</span>
                                                <i className="flaticon-arrow-right"></i>
                                             </a>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
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
