import React from "react";
import {Link, useNavigate} from "react-router-dom";
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
      title: "Welcome, Emily Hannah",
      sidebar_details: [
         {
            id: 1,
            link: "/student-dashboard",
            icon: "fas fa-home",
            title: "Dashboard",
         },
         {
            id: 2,
            link: "/student-profile",
            icon: "skillgro-avatar",
            title: "My Profile",
         },
         {
            id: 3,
            link: "/student-enrolled-courses",
            icon: "skillgro-book",
            title: "Enrolled Courses",
         },
         {
            id: 4,
            link: "/student-wishlist",
            icon: "skillgro-label",
            title: "Favorites",
         },
         /*{
            id: 5,
            link: "/student-review",
            icon: "skillgro-book-2",
            title: "Reviews",
         },*/
         {
            id: 6,
            link: "/student-attempts",
            icon: "skillgro-question",
            title: "My Quiz Attempts",
         },
         /*{
            id: 7,
            link: "/student-history",
            icon: "skillgro-satchel",
            title: "Order History",
         },*/
      ],
   },
   {
      id: 2,
      title: "User",
      class_name: "mt-30",
      sidebar_details: [
         {
            id: 1,
            link: "/student-setting",
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

const DashboardSidebarTwo = () => {
   const {user, logout} = useAuth();

   const navigate = useNavigate();

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

   const handleLogout = () => {
      logout(); // Kullanıcıyı çıkar
      navigate("/"); // Ana sayfaya yönlendir
   };

   return (
      <div className="col-lg-3">
         <div className="dashboard__sidebar-wrap">
            {sidebar_data.map((item) => (
               <React.Fragment key={item.id}>
                  <div className={`dashboard__sidebar-title mb-20 ${item.class_name}`}>
                     <h6 className="title">Welcome, {user.name}</h6>
                  </div>
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
                                  <Link to={`${list.link}/${user.id}`}>
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

export default DashboardSidebarTwo