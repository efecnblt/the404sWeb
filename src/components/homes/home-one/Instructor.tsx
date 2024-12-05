import { Link } from "react-router-dom";
import BtnArrow from "../../../svg/BtnArrow";
import {collection, getDocs} from "firebase/firestore";
import {useEffect, useState} from "react";
import {db} from "../../../firebase/firebaseConfig.ts";


interface DataType {
   id: string;
   image_url: string
   name: string;
   designation: string;
   rating: number;
};



function Instructor (){

   const [instructors, setInstructors] = useState([]);

   useEffect(() => {
      const fetchInstructors = async () => {
         try {
            console.log("Fetching instructors from Firestore...");

            const querySnapshot = await getDocs(collection(db, "authors"));
            console.log("Query snapshot size:", querySnapshot.size);

            const instructorsData = querySnapshot.docs.map((doc) => {
               const data = doc.data();
               console.log("Fetched document data:", data);

               return {
                  id: data.id || doc.id, // doc.id as fallback if id is missing in the data
                  image_url: data.image_url || "", // Ensure `image_url` exists and is a string
                  name: data.name || "", // Ensure `name` exists and is a string
                  designation: data.department || "efe", // Default `designation` to "efe" if missing
                  rating: data.rating || "0", // Default `rating` to "0" if missing
               };
            });

            console.log("Processed instructors data:", instructorsData);

            setInstructors(instructorsData);
         } catch (error) {
            console.error("Error fetching instructors: ", error);
         }
      };
      fetchInstructors();
   }, []);

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
                        {instructors.slice(0,4).map((instructor) => (
                           <div key={instructor.id} className="col-sm-6">
                              <div className="instructor__item">
                                 <div className="instructor__thumb">
                                    <Link to={`/instructor-details/${instructor.id}`}><img src={instructor.image_url} alt="img" style={{
                                       width: "180px",
                                       height: "180px",
                                       borderRadius: "50%",
                                       objectFit: "cover",
                                       border: "2px solid #ccc",
                                       boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    }}/></Link>
                                 </div>
                                 <div className="instructor__content">
                                    <h2 className="title"><Link to={`/instructor-details/${instructor.id}`}>{instructor.name}</Link></h2>
                                    <span className="designation">{instructor.designation}</span>
                                    <p className="avg-rating">
                                       <i className="fas fa-star"></i>{instructor.rating}
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
