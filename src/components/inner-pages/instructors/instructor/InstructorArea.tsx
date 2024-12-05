import { Link } from "react-router-dom"
import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../../../../firebase/firebaseConfig.ts";



interface DataType {
    id: string;
    image_url: string
    name: string;
    designation: string;
    rating: string;
};

function InstructorArea () {

    const [instructors, setInstructors] = useState<DataType[]>([]);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "authors"));
                const instructorsData = querySnapshot.docs.map((doc) => ({
                    id:  doc.id, // Ensure `id` is a number
                    image_url: doc.data().image_url || "", // Ensure `thumb` exists and is a string
                    name: doc.data().name || "", // Ensure `title` exists and is a string
                    designation: doc.data().department || "efe", // Ensure `designation` exists and is a string
                    rating: doc.data().rating || "0", // Default `rating` to "0" if missing
                }));
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
            <div className="row">
               {instructors.map((instructor) => (
                  <div key={instructor.id} className="col-xl-4 col-sm-6">
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
                              <i className="fas fa-star"></i>
                               {instructor.rating}
                           </p>
                           <div className="instructor__social">
                              <ul className="list-wrap">
                                 <li><Link to="#"><i className="fab fa-facebook-f"></i></Link></li>
                                 <li><Link to="#"><i className="fab fa-twitter"></i></Link></li>
                                 <li><Link to="#"><i className="fab fa-whatsapp"></i></Link></li>
                                 <li><Link to="#"><i className="fab fa-instagram"></i></Link></li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   )
}

export default InstructorArea
