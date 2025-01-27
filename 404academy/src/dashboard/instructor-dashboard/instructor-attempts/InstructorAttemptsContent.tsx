import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {useAuth} from "../../../firebase/AuthContext.tsx";

interface IAuthorInfoResponse {
   data: {
      authorID: number;
      userId: number;
      name: string;
      biography: string;
      departmentID: number;
      rating: number;
      studentCount: number;
      courseCount: number;
      imageURL: string;
   };
   success: boolean;
   message: string | null;
}

interface IAuthorProfile {
   authorID: number;
   name: string;
   biography: string;
   departmentID: number;
   rating: number;
   studentCount: number;
   courseCount: number;
   imageURL: string;
   courses: ICourse[];
}

interface ICourse {
   courseID: number;
   name: string;
   description: string;
   rating: number;
   price: number;
   totalStudentCount: number;
}

interface ISection {
   sectionID: number;
   courseID: number;
   order: number;
   title: string;
}

interface IQuiz {
   quizID: number;
   sectionID: number;
   name: string;
   totalPoints: number;
}

const InstructorAttemptsContent: React.FC = () => {
   // Uygulamada giriş yapan kullanıcının id'sini aldığınızı varsayıyoruz (örnek 20).
   const {user} = useAuth();
   const [authorId, setAuthorId] = useState<number | null>(null);
   const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string>("");

   /**
    * 1) userId -> authorID çek
    */
   useEffect(() => {
      const fetchAuthorId = async () => {
         try {
            setLoading(true);
            // Örneğin: GET /api/Authors/getbyuser/{userId} gibi bir endpoint varsa onu kullanın
            // Sizde "http://165.232.76.61:5001/api/Authors/getauthorbyuser?userId=20" gibi olabilir.
            const response = await axios.get<IAuthorInfoResponse>(
                `http://165.232.76.61:5001/api/Authors/getbyuserid/${user?.id}`
            );

            // success true ise ve data varsa authorID'yi al
            if (response.data?.success && response.data.data.authorID) {
               setAuthorId(response.data.data.authorID);
            } else {
               setError("Author not found for this user.");
            }
         } catch (err) {
            console.error("fetchAuthorId error:", err);
            setError("Failed to fetch author ID.");
         } finally {
            setLoading(false);
         }
      };

      fetchAuthorId();
   }, [user?.id]);

   /**
    * 2) authorID -> Tüm kursları, sectionları ve quizleri çek
    */
   useEffect(() => {
      // authorID hazır değilse bekle
      if (!authorId) return;

      const fetchAllQuizzes = async () => {
         try {
            setLoading(true);
            setError("");

            // 2a) Yazar profilini (veya kurslarını) al
            // Örneğin: GET /api/Authors/getauthorallprofile?authorId=9
            const authorProfileResp = await axios.get<IAuthorProfile>(
                `http://165.232.76.61:5001/api/Authors/getauthorallprofile?authorId=${authorId}`
            );
            const authorProfile = authorProfileResp.data;

            const allQuizzes: IQuiz[] = [];

            // 2b) Her kurstaki sectionları ve quizleri çek
            for (const course of authorProfile.courses) {
               // Kursun sectionlarını getir
               const sectionsResp = await axios.get<ISection[]>(
                   `http://165.232.76.61:5001/api/Sections/course/${course.courseID}`
               );
               const sections = sectionsResp.data;

               // Her section'un quizlerini al
               for (const section of sections) {
                  // Quiz endpointi örnek: GET /api/Quiz/section/{sectionID}
                  try {
                     const quizzesResp = await axios.get<IQuiz[]>(
                         `http://165.232.76.61:5001/api/Quiz/section/${section.sectionID}`
                     );
                     const sectionQuizzes = quizzesResp.data;

                     // Hepsini allQuizzes'e ekle
                     allQuizzes.push(...sectionQuizzes);
                  } catch (quizError) {
                     // Bazı section'larda quiz yoksa veya hata alırsanız
                     console.error("Quiz fetch error for section:", section.sectionID, quizError);
                  }
               }
            }

            setQuizzes(allQuizzes);
         } catch (err: any) {
            console.error("fetchAllQuizzes error:", err);
            setError("Quizzes could not be fetched.");
         } finally {
            setLoading(false);
         }
      };

      fetchAllQuizzes();
   }, [authorId]);

   if (loading) {
      return <div>Loading...</div>;
   }

   if (error) {
      return <div className="text-danger">{error}</div>;
   }

   return (
       <div className="col-lg-9">
          <div className="dashboard__content-wrap">
             {/* Başlık ve Buton */}
             <div className="dashboard__content-title d-flex justify-content-between align-items-center">
                <h4 className="title mb-0">All Quizzes</h4>
                <Link to="/add-quiz" className="btn btn-primary">
                   + Add New Quiz
                </Link>
             </div>

             {/* Tabloda Quizleri Listele */}
             <div className="dashboard__review-table mt-3">
                {quizzes.length > 0 ? (
                    <table className="table table-borderless">
                       <thead>
                       <tr>
                          <th>#</th>
                          <th>Quiz Name</th>
                          <th>Section ID</th>
                          <th>Total Points</th>
                          <th>Action</th>
                       </tr>
                       </thead>
                       <tbody>
                       {quizzes.map((quiz, index) => (
                           <tr key={quiz.quizID}>
                              <td>{index + 1}</td>
                              <td>{quiz.name}</td>
                              <td>{quiz.sectionID}</td>
                              <td>{quiz.totalPoints}</td>
                              <td>
                                 <div className="dashboard__review-action">
                                    <Link to="#" title="Edit" className="me-2">
                                       <i className="skillgro-edit"></i>
                                    </Link>
                                    <Link to="#" title="Delete">
                                       <i className="skillgro-bin"></i>
                                    </Link>
                                 </div>
                              </td>
                           </tr>
                       ))}
                       </tbody>
                    </table>
                ) : (
                    <p>No quizzes found.</p>
                )}
             </div>
          </div>
       </div>
   );
};

export default InstructorAttemptsContent;
