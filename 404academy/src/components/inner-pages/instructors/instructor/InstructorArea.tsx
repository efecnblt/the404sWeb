import { Link } from "react-router-dom"
import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../../../../firebase/firebaseConfig.ts";



interface DataType {
    authorID: number;
    name: string;
    biography: string;
    departmentID: number;
    rating: number;
    studentCount: number;
    courseCount: number;
    imageURL: string;
};

function InstructorArea () {

    const [instructors, setInstructors] = useState<DataType[]>([]);
    const [departments, setDepartments] = useState<DepartmentType[]>([]);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await fetch("http://165.232.76.61:5001/api/Authors/getall");
                if (!response.ok) {
                    throw new Error("Failed to fetch instructors.");
                }
                const data = await response.json();

                const instructorsData = data.map((instructor: any) => ({
                    authorID: instructor.authorID,
                    name: instructor.name || "Unknown Instructor",
                    biography: instructor.biography || "Biography not available.",
                    departmentID: instructor.departmentID || 0,
                    rating: instructor.rating || 0,
                    studentCount: instructor.studentCount || 0,
                    courseCount: instructor.courseCount || 0,
                    imageURL: instructor.imageURL || "https://via.placeholder.com/180", // Placeholder if no image
                }));

                setInstructors(instructorsData);
            } catch (error) {
                console.error("Error fetching instructors: ", error);
            }
        };

        const fetchDepartments = async () => {
            try {
                const response = await fetch("http://165.232.76.61:5001/api/Departments");
                if (!response.ok) {
                    throw new Error("Failed to fetch departments.");
                }
                const data = await response.json();
                setDepartments(data);
            } catch (error) {
                console.error("Error fetching departments: ", error);
            }
        };
        fetchDepartments();
        fetchInstructors();
    }, []);

    const getDepartmentName = (departmentID: number): string => {
        const department = departments.find((dept) => dept.departmentID === departmentID);
        return department ? department.departmentName : "Unknown Department";
    };

   return (
      <section className="instructor__area">
         <div className="container">
            <div className="row">
               {instructors.map((instructor) => (
                  <div key={instructor.authorID} className="col-xl-4 col-sm-6">
                     <div className="instructor__item">
                        <div className="instructor__thumb">

                           <Link to={`/instructor-details/${instructor.authorID}`}><img src={instructor.imageURL} alt="img" style={{
                               width: "180px",
                               height: "180px",
                               borderRadius: "50%",
                               objectFit: "cover",
                               border: "2px solid #ccc",
                               boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                           }}/></Link>
                        </div>
                        <div className="instructor__content">
                           <h2 className="title"><Link to={`/instructor-details/${instructor.authorID}`}>{instructor.name}</Link></h2>
                           <span className="designation">{getDepartmentName(instructor.departmentID)}</span>
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
