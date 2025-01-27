import { useEffect, useState } from "react";
import Count from "../../../components/common/Count";
import { createStudentDashboardData } from "../../../data/dashboard-data/StudentDashboardData";
import DashboardBannerTwo from "../../dashboard-common/DashboardBannerTwo";
import DashboardCourse from "../../dashboard-common/DashboardCourse";
import DashboardSidebarTwo from "../../dashboard-common/DashboardSidebarTwo";
import { useAuth } from "../../../firebase/AuthContext.tsx";
import axios from "axios";
import { toast } from "react-toastify";
import {Mosaic} from "react-loading-indicators";

const StudentDashboardArea = () => {
   const { user } = useAuth();
   const [dashboardData, setDashboardData] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchStudentDashboardData = async () => {
         try {
            if (!user?.id) {
               toast.error("User not authenticated");
               return;
            }

            // Fetch number of courses enrolled
            const enrolledResponse = await axios.get(`http://165.232.76.61:5001/api/Courses/enrolled/${user.id}`);
            const enrolledCoursesCount = enrolledResponse.data.enrolledCoursesCount; // Adjust based on actual response structure

            // Create dashboard data for students
            const newDashboardData = createStudentDashboardData(
               enrolledCoursesCount // Only using enrolled courses count now
            );

            setDashboardData(newDashboardData);
         } catch (error) {
            console.error("Error fetching student dashboard data:", error);
            toast.error("Failed to load student dashboard data");
         } finally {
            setLoading(false);
         }
      };

      fetchStudentDashboardData();
   }, [user]);

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
      <section className="dashboard__area section-pb-120">
         <div className="container">
            <DashboardBannerTwo />
            <div className="dashboard__inner-wrap">
               <div className="row">
                  <DashboardSidebarTwo />
                  <div className="col-lg-9">
                     <div className="dashboard__count-wrap">
                        <div className="dashboard__content-title">
                           <h4 className="title">Dashboard</h4>
                        </div>
                        <div className="row">
                           {dashboardData.map((item) => (
                              <div key={item.id} className="col-lg-6 col-md-6 col-sm-12">
                                 <div className="dashboard__counter-item">
                                    <div className="icon">
                                       <i className={item.icon}></i>
                                    </div>
                                    <div className="content">
                                       <span className="count"><Count number={item.count} /></span>
                                       <p style={{ marginTop: "14px" }}>{item.title}</p>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                     <DashboardCourse />
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}

export default StudentDashboardArea;
