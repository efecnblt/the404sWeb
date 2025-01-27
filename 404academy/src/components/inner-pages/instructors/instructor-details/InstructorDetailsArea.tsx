import { Link, useParams } from "react-router-dom";
import InstructorSlider from "./InstructorSlider";
import InstructorForm from "../../../../forms/InstructorForm";
import { db } from "../../../../firebase/firebaseConfig";
import {collection, doc, getDoc, getDocs} from "firebase/firestore";
import { useEffect, useState } from "react";
import axios from "axios";

interface DataType {
  id: number;
  title: string;
  count: number;
}

const progress_data: DataType[] = [
  { id: 1, title: "PHP", count: 88 },
  { id: 2, title: "React", count: 65 },
  { id: 3, title: "Java", count: 55 },
  { id: 4, title: "Angular", count: 40 },
];

interface Course {
  id: string;
  coursename: string;
  courserating: number;
}

interface Instructor {
  id: string;
  name: string;
  department: string;
  rating: number;
  description: string;
  image_url: string;
  courses?: Course[];
}


type AuthorAPIResponse = {
  authorID: number;
  name: string;
  biography: string;
  departmentID: number;
  rating: number;
  studentCount: number;
  courseCount: number;
  imageURL: string;
};


const  InstructorDetailsArea = ({ setInstructorName }: { setInstructorName: (name: string) => void }) =>  {
  const { instructorId } = useParams();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  console.log("Instructor ID:", instructorId);
  useEffect(() => {
    const fetchInstructorDetails = async () => {
      if (!instructorId) {
        setError("Instructor ID not provided.");
        setLoading(false);
        return;
      }

      try {
        // --- 1) API'den instructor (author) bilgisini çek
        // Örnek: http://165.232.76.61:5001/api/Authors/getbyid/8
        const response = await axios.get<AuthorAPIResponse>(
            `http://165.232.76.61:5001/api/Authors/getbyid/${instructorId}`
        );

        const authorData = response.data;

        // 2) Yazar ismini parent’a bildirmek için:
        setInstructorName(authorData.name);

        // 3) instructor state'ini güncelle
        setInstructor({
          id: authorData.authorID.toString(),
          name: authorData.name,
          // department bilgisini API'de "departmentID" olarak döndüğü için
          // dilerseniz başka bir endpoint'ten veya sabit tablo ile eşleştirebilirsiniz.
          // Şimdilik placeholder bir string veriyoruz:
          department: `Department ${authorData.departmentID}`,
          rating: authorData.rating,
          description: authorData.biography,
          image_url: authorData.imageURL,
          // eğer kursları da çekmek isterseniz, separate bir endpoint olabilir.
          // Yukarıdaki "courseCount" var ama detaylar yok.
          courses: [],
        });
      } catch (err) {
        console.error("Error fetching instructor details:", err);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorDetails();
  }, [instructorId, setInstructorName]);


  if (loading) {
    return <p className="text-center">Loading instructor details...</p>;
  }

  if (error) {
    return <p className="text-center">{error}</p>;
  }

  if (!instructor) {
    return <p className="text-center">Instructor not found!</p>;
  }

  return (
      <section className="instructor__details-area section-pt-120 section-pb-90">
        <div className="container">
          <div className="row">
            <div className="col-xl-9">
              <div className="instructor__details-wrap">
                <div className="instructor__details-info">
                  <div className="instructor__details-thumb">
                    <img
                        src={instructor.image_url || "/assets/img/instructor/default_instructor.png"}
                        alt={`${instructor.name}'s profile`}
                    />
                  </div>
                  <div className="instructor__details-content">
                    <h2 className="title">{instructor.name}</h2>
                    <span className="designation">{instructor.department}</span>
                    <ul className="list-wrap">
                      <li className="avg-rating">
                        <i className="fas fa-star"></i>{instructor.rating}
                      </li>
                      <li>
                        <i className="far fa-envelope"></i>
                        <Link to={`mailto:${instructorId}@example.com`}>{instructorId}@example.com</Link>
                      </li>
                      <li>
                        <i className="fas fa-phone-alt"></i>
                        <Link to="tel:+123456789">+123 456 789</Link>
                      </li>
                    </ul>
                    <p>{instructor.description || "No description available."}</p>
                    <div className="instructor__details-social">
                      <ul className="list-wrap">
                        <li><Link to="#"><i className="fab fa-facebook-f"></i></Link></li>
                        <li><Link to="#"><i className="fab fa-twitter"></i></Link></li>
                        <li><Link to="#"><i className="fab fa-instagram"></i></Link></li>
                        <li><Link to="#"><i className="fab fa-whatsapp"></i></Link></li>
                        <li><Link to="#"><i className="fab fa-youtube"></i></Link></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="instructor__details-biography">
                  <h4 className="title">Biography</h4>
                  <p>{instructor.description || "Biography not available."}</p>
                </div>
                {/*<div className="instructor__details-Skill">
                  <h4 className="title">Skills</h4>
                  <div className="instructor__progress-wrap">
                    <ul className="list-wrap">
                      {progress_data.map((item) => (
                          <li key={item.id}>
                            <div className="progress-item">
                              <h6 className="title">
                                {item.title} <span>{item.count}%</span>
                              </h6>
                              <div className="progress" role="progressbar" aria-label="Example with label">
                                <div className="progress-bar" style={{ width: `${item.count}%` }}></div>
                              </div>
                            </div>
                          </li>
                      ))}
                    </ul>
                  </div>
                </div>*/}

                <div className="instructor__details-courses">
                  <div className="row align-items-center mb-30">
                    <div className="col-md-8">
                      <h2 className="main-title">My Courses</h2>
                    </div>
                    <div className="col-md-4">
                      <div className="instructor__details-nav">
                        <button className="courses-button-prev"><i className="flaticon-arrow-right"></i></button>
                        <button className="courses-button-next"><i className="flaticon-arrow-right"></i></button>
                      </div>
                    </div>
                  </div>
                  <InstructorSlider />
                </div>
              </div>
            </div>

            <div className="col-xl-3">
              <div className="instructor__sidebar">
                <h4 className="title">Quick Contact</h4>
                <p>Feel free to contact us through social platforms!</p>
                <InstructorForm />
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}

export default InstructorDetailsArea;
