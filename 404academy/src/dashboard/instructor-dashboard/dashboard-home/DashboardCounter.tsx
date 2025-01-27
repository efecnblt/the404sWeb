import { useEffect, useState } from "react";
import axios from "axios";
import Count from "../../../components/common/Count";
import { createDashboardData, DataType } from "../../../data/dashboard-data/DashboardCounterData";
import { useAuth } from "../../../firebase/AuthContext.tsx";
import { toast } from "react-toastify";
import {Mosaic} from "react-loading-indicators";

const DashboardCounter = () => {
   const { user } = useAuth();
   const [dashboardData, setDashboardData] = useState<DataType[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchDashboardData = async () => {
         try {
            

            // First get author ID using user ID
            const authorResponse = await axios.get(`http://165.232.76.61:5001/api/Authors/getbyuserid/${user?.id}`);
            const authorId = authorResponse.data.data.authorID;

            // Then get author's profile data
            const profileResponse = await axios.get(
               `http://165.232.76.61:5001/api/Authors/getauthorallprofile?authorId=${authorId}`
            );
            
            const authorData = profileResponse.data;
            
            // Calculate total earnings (sum of all course prices * their student counts)
            const totalEarnings = authorData.courses.reduce((sum: number, course: any) => 
               sum + (course.price * course.totalStudentCount), 0);

            // Create dashboard data with dynamic values
            const newDashboardData = createDashboardData(
               authorData.courseCount,
               authorData.studentCount,
               totalEarnings
            );

            setDashboardData(newDashboardData);
         } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("Failed to load dashboard data");
         } finally {
            setLoading(false);
         }
      };

      fetchDashboardData();
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
      <>
         {dashboardData.map((item) => (
            <div key={item.id} className="col-lg-4 col-md-4 col-sm-6">
               <div className="dashboard__counter-item">
                  <div className="icon">
                     <i className={item.icon}></i>
                  </div>
                  <div className="content">
                     <span className="count"><Count number={item.count} /></span>
                     <p style={{marginTop:"5px"}}>{item.title}</p>
                  </div>
               </div>
            </div>
         ))}
      </>
   );
};

export default DashboardCounter;