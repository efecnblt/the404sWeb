import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {useAuth} from "../../firebase/AuthContext.tsx";
import {Mosaic} from "react-loading-indicators";

interface DataType {
   id: number;
   title: string;
   class_name?: string;
   sidebar_details: {
      id: number;
      link: string;
      icon: string;
      title: string;
   }[];
};

const sidebar_data: DataType[] = [
   {
      id: 1,
      title: "Welcome, Jone Due",
      sidebar_details: [
         {
            id: 1,
            link: "/instructor-dashboard",
            icon: "fas fa-home",
            title: "Dashboard",
         },
         {
            id: 2,
            link: "/instructor-profile",
            icon: "skillgro-avatar",
            title: "My Profile",
         },
         {
            id: 3,
            link: "/instructor-enrolled-courses",
            icon: "skillgro-book",
            title: "Enrolled Courses",
         },
         /*{
            id: 4,
            link: "/instructor-wishlist",
            icon: "skillgro-label",
            title: "Wishlist",
         },*/
         /*{
            id: 5,
            link: "/instructor-review",
            icon: "skillgro-book-2",
            title: "Reviews",
         },*/
         {
            id: 4,
            link: "/instructor-attempts",
            icon: "skillgro-question",
            title: "Quizzes",
         },
         /*{
            id: 7,
            link: "/instructor-history",
            icon: "skillgro-satchel",
            title: "Order History",
         },*/
      ],
   },

   {
      id: 3,
      title: "User",
      class_name: "mt-30",
      sidebar_details: [
         {
            id: 1,
            link: "/instructor-setting",
            icon: "skillgro-settings",
            title: "Settings",
         },
         {
            id: 2,
            link: "/",
            icon: "skillgro-logout",
            title: "Logout",
         },
      ],
   },
];

const DashboardSidebar = () => {

   const {user, logout} = useAuth();
   const navigate = useNavigate();

   const handleLogout = () => {
      logout(); // Kullanıcıyı çıkar
      navigate("/"); // Ana sayfaya yönlendir
   };
   if (!user) {
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
      <div className="col-lg-3">
         <div className="dashboard__sidebar-wrap">
            <div className="dashboard__sidebar-title mb-20">
               <h6 className="title">Welcome, {user.name + " " + user.surname}</h6>
            </div>
            {sidebar_data.map((item) => (
                <React.Fragment key={item.id}>
                   {item.class_name && (
                       <div className={`dashboard__sidebar-title mb-20 ${item.class_name}`}>

                       </div>
                   )}
                   <nav className="dashboard__sidebar-menu">
                      <ul className="list-wrap">
                         {item.sidebar_details.map((list) => (
                             <li key={list.id}>
                                {list.title === "Logout" ? (
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                           background: "none",
                                           border: "none",
                                           color: "gray",
                                           cursor: "pointer",
                                           textAlign: "left",
                                           padding: "0",
                                           display: "flex", // Yan yana düzen
                                           alignItems: "center", // Dikey hizalama
                                           gap: "8px", // İkon ve yazı arasında boşluk
                                        }}
                                    >
                                       <i className={list.icon}></i>
                                       <span>Logout</span>
                                    </button>

                                ) : (
                                    <Link to={`${list.link}/${user?.id}`}>
                                       <i className={list.icon}></i>
                                       {list.title}
                                    </Link>
                                )}

                             </li>
                         ))}
                      </ul>
                   </nav>
                </React.Fragment>
            ))}
         </div>
      </div>
   )
}

export default DashboardSidebar