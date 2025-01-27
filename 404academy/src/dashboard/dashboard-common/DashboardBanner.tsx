import { Link } from "react-router-dom"
import BtnArrow from "../../svg/BtnArrow"
import {useAuth} from "../../firebase/AuthContext.tsx";

const DashboardBanner = () => {


   const {user} = useAuth();


   return (
      <div className="dashboard__top-wrap">
         <div className="dashboard__top-bg" style={{ backgroundImage: `url(/assets/img/bg/instructor_dashboard_bg02.png)` }}></div>
         <div className="dashboard__instructor-info">
            <div className="dashboard__instructor-info-left">
               <div className="thumb">
                  <img src={user?.imageUrl} alt="" />
               </div>
               <div className="content">
                  <h4 className="title">{user?.name + " " + user?.surname}</h4>
                  <div className="review__wrap review__wrap-two">
                     <div className="rating">
                        <i className="fas">{user?.email}</i>
                     </div>
                  </div>
               </div>
            </div>
            <div className="dashboard__instructor-info-right">
               <Link to="/create-course" className="btn btn-two arrow-btn">Create a New Course <BtnArrow /></Link>
            </div>
         </div>
      </div>
   )
}

export default DashboardBanner
