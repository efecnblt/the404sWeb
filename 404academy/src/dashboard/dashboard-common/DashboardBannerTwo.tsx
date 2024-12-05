import InjectableSvg from "../../hooks/InjectableSvg"

import { useAuth } from "../../firebase/AuthContext";

const DashboardBannerTwo =  ()=> {
   const {user} = useAuth();

   return (
      <div className="dashboard__top-wrap">
         <div className="dashboard__top-bg" style={{ backgroundImage: `url(/assets/img/bg/features_bg.jpg)` }}></div>
         <div className="dashboard__instructor-info">
            <div className="dashboard__instructor-info-left">
               <div className="thumb">
                  <img src={user?.profileImage} alt="img" />
               </div>
               <div className="content">
                  <h4 className="title">{user?.name}</h4>
                  <ul className="list-wrap">
                     <li>
                        <InjectableSvg src="/assets/img/icons/course_icon03.svg" alt="img" className="injectable" />
                        5 Courses Enrolled
                     </li>
                     <li>
                        <InjectableSvg src="/assets/img/icons/course_icon05.svg" alt="img" className="injectable" />
                        4 Certificate
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
   )
}

export default DashboardBannerTwo
