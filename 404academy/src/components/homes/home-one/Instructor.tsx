import { Link } from "react-router-dom";
import BtnArrow from "../../../svg/BtnArrow";
import {useEffect, useState} from "react";
import axios from "axios";


type Author = {
   authorID: number;
   name: string;
   biography: string;
   departmentID: number;
   rating: number;
   studentCount: number;
   courseCount: number;
   imageURL: string;
};

type Department = {
   departmentID: number;
   departmentName: string;
};

function Instructor (){

   const [authors, setAuthors] = useState<Author[]>([]);
   const [departments, setDepartments] = useState<Department[]>([]);


   useEffect(() => {
      axios
          .get<Author[]>("http://165.232.76.61:5001/api/Authors/getall")
          .then((response) => {
             setAuthors(response.data); // Gelen veriyi state'e ata
          })
          .catch((error) => {
             console.error("API Hatası:", error);
          });
      axios
          .get<Department[]>("http://165.232.76.61:5001/api/Departments")
          .then((response) => {
             setDepartments(response.data); // Departments verisini state'e ata
          })
          .catch((error) => {
             console.error("Departments API Hatası:", error);
          });
   }, []);

   const getDepartmentName = (id: number): string => {
      const department = departments.find((dept) => dept.departmentID === id);
      return department ? department.departmentName : "Unknown Department";
   };

   return (
      <section className="instructor__area">
         <div className="container">
            <div className="row align-items-center">
               <div className="col-xl-4">
                  <div className="instructor__content-wrap">
                     <div className="section__title mb-15">
                        <span className="sub-title">Best Instructors</span>
                        <h2 className="title">Learn from Our Dedicated and Skilled Instructors</h2>
                     </div>
                     <p>Guiding you step by step with personalized teaching methods, our instructors are here to help you build knowledge and confidence in every lesson</p>
                     <div className="tg-button-wrap">
                        <Link to="/instructors" className="btn arrow-btn">See All Instructors<BtnArrow /></Link>
                     </div>
                  </div>
               </div>

               <div className="col-xl-8">
                  <div className="instructor__item-wrap">
                     <div className="row">
                        {authors.slice(0,4).map((author) => (

                           <div key={author.authorID} className="col-sm-6">
                              <div className="instructor__item">
                                 <div className="instructor__thumb">
                                    <Link to={`/instructor-details/${author.authorID}`}><img src={author.imageURL} alt="img" style={{
                                       width: "180px",
                                       height: "180px",
                                       borderRadius: "50%",
                                       objectFit: "cover",
                                       border: "2px solid #ccc",
                                       boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    }}/></Link>
                                 </div>
                                 <div className="instructor__content">
                                    <h2 className="title"><Link to={`/instructor-details/${author.authorID}`}>{author.name}</Link></h2>
                                    <span className="designation">{getDepartmentName(author.departmentID)} {/* Burada departman adı */}</span>
                                    <p className="avg-rating">
                                       <i className="fas fa-star"></i>{author.rating}
                                    </p>

                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}

export default Instructor
