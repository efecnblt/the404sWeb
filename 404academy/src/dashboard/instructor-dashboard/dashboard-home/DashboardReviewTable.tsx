import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Mosaic } from "react-loading-indicators";
import { useAuth } from "../../../firebase/AuthContext";

interface CourseDetail {
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

const formatPrice = (price: number | undefined): string => {
   return price !== undefined ? price.toFixed(2) : '0.00';
};

const DashboardReviewTable = () => {
   const [courses, setCourses] = useState<CourseDetail[]>([]);
   const [loading, setLoading] = useState(true);
   const [deleting, setDeleting] = useState<number | null>(null);
   const { user } = useAuth();
   
   
   useEffect(() => {
      fetchInstructorCourses();
   }, []);

   const fetchCourseDetails = async (courseId: number): Promise<CourseDetail | null> => {
      try {
         const response = await axios.get(
             `http://165.232.76.61:5001/api/Courses/getbyid?id=${courseId}`
         );

         // Check if response has data property
         if (response.data && response.data.data) {
            const courseData = response.data.data;
            return {
               courseID: courseId,
               name: courseData.name || '',
               categoryId: courseData.categoryId || 0,
               description: courseData.description || '',
               authorId: courseData.authorId || 9,
               rating: courseData.rating || 0,
               ratingCount: courseData.ratingCount || 0,
               price: courseData.price || 0,
               discount: courseData.discount || 0,
               totalStudentCount: courseData.totalStudentCount || 0,
               image: courseData.image || '',
               hashtags: courseData.hashtags || '',
               levelId: courseData.levelId || 0
            };
         }
         return null;
      } catch (error) {
         console.error(`Error fetching details for course ${courseId}:`, error);
         return null;
      }
   };

   const fetchInstructorCourses = async () => {
      try {
         
          // 1. First get author ID using user ID
         const response = await axios.get(`http://165.232.76.61:5001/api/Authors/getbyuserid/${user?.id}`);
         const authorId = response.data.data.authorID;

         // 1. First get all course IDs from author's profile
         const authorResponse = await axios.get(
             `http://165.232.76.61:5001/api/Authors/getauthorallprofile?authorId=${authorId}`
         );

         console.log('Author Response:', authorResponse.data);

         // Make sure we're accessing the courses array correctly
         const authorCourses = authorResponse.data.courses || [];
         console.log('Author Courses:', authorCourses);

         // 2. Fetch detailed information for each course
         const courseDetailsPromises = authorCourses.map(course =>
             fetchCourseDetails(course.courseID)
         );

         const courseDetails = await Promise.all(courseDetailsPromises);
         console.log('Course Details:', courseDetails);

         // Filter out any null values from failed requests
         const validCourses = courseDetails.filter((course): course is CourseDetail =>
             course !== null
         );

         console.log('Valid Courses:', validCourses);
         setCourses(validCourses);
      } catch (error) {
         console.error("Error fetching courses:", error);
         toast.error("Failed to load courses");
      } finally {
         setLoading(false);
      }
   };

   const handleDeleteCourse = async (courseId: number) => {
      if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
         return;
      }

      setDeleting(courseId);
      try {
         // 1. Delete learning outcomes associated with the course
         await axios.delete(`http://165.232.76.61:5001/api/LearningOutcomes/course/${courseId}`);

         // 2. Get all sections associated with the course
         const sectionsResponse = await axios.get(
             `http://165.232.76.61:5001/api/Sections/course/${courseId}`
         );

         // 3. Iterate through each section to delete the section
         for (const section of sectionsResponse.data) {
            // Delete the section
            await axios.delete(`http://165.232.76.61:5001/api/Sections/${section.sectionID}`);
         }

         // 4. Finally, delete the course
         await axios.delete(`http://165.232.76.61:5001/api/Courses/${courseId}`);

         // 5. Update the UI by removing the deleted course
         setCourses((prev) => prev.filter((course) => course.courseID !== courseId));
         toast.success("Course deleted successfully");
      } catch (error) {
         console.error("Error deleting course:", error);
         toast.error("Failed to delete course");
      } finally {
         setDeleting(null);
      }
   };


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
       <div className="dashboard-courses">

          <div className="dashboard-courses__table">
             {courses.length === 0 ? (
                 <div className="no-courses-message">
                    <p>No courses found. Start by creating your first course!</p>
                    <Link to="/create-course" className="btn btn-two">
                       Create Course
                    </Link>
                 </div>
             ) : (
                 <table className="table cart__table">
                    <thead>
                    <tr>
                       <th className="product__thumb">&nbsp;</th>
                       <th className="product__name">Course</th>
                       <th className="product__price">Price</th>
                       <th>Students</th>
                       <th>Rating</th>
                       <th className="product__remove">&nbsp;</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courses.map((course) => (
                        <tr key={course.courseID}>
                           <td className="product__thumb">
                              <Link to={`/course-details/${course.courseID}`}>
                                 <img
                                     src={course.image || "https://via.placeholder.com/50"}
                                     alt={course.name}
                                 />
                              </Link>
                           </td>
                           <td className="product__name">
                              <Link to={`/course-details/${course.authorId}/${course.courseID}`}>
                                 {course.name}
                              </Link>
                           </td>
                           <td className="product__price">
                              {course.discount > 0 ? (
                                  <>
                                     <del>${formatPrice((course.price || 0) + (course.discount || 0))}</del>{" "}
                                     <span>${formatPrice(course.price)}</span>
                                  </>
                              ) : (
                                  <>${formatPrice(course.price)}</>
                              )}
                           </td>
                           <td>
                              <span className="color-black">{course.totalStudentCount || 0}</span>
                           </td>
                           <td>
                              <div className="review__wrap">
                                 <div className="rating">
                                    {[...Array(5)].map((_, index) => (
                                        <i
                                            key={`star-${course.courseID}-${index}`}
                                            className={`fas fa-star ${index < Math.round(course.rating || 0) ? 'active' : ''}`}
                                        ></i>
                                    ))}
                                 </div>
                                 ({course.rating})
                              </div>
                           </td>
                           <td className="product__remove">
                              <button
                                  onClick={() => handleDeleteCourse(course.courseID)}
                                  disabled={deleting === course.courseID}
                              >
                                 {deleting === course.courseID ? (
                                     <span className="spinner-border spinner-border-sm" />
                                 ) : (
                                     <i className="fas fa-trash-alt"></i>
                                 )}
                              </button>
                           </td>
                        </tr>
                    ))}
                    </tbody>
                 </table>
             )}
          </div>
       </div>
   );
};

export default DashboardReviewTable;
