"use client";
import { Link } from "react-router-dom";
import {useAuth} from "../../../firebase/AuthContext.tsx";

const InstructorSettingProfile = ({ style }: any) => {

   const {user} = useAuth();

   return (
      <>
         {style ? (
            <div
               className="instructor__cover-bg"
               style={{ backgroundImage: `url(/assets/img/bg/features_bg.jpg)` }}
            >
               <div className="instructor__cover-info">
                  <div className="instructor__cover-info-left">
                     <div className="thumb">
                        <img src={user?.profileImage} alt="img" />
                     </div>
                     <button title="Upload Photo">
                        <i className="fas fa-camera"></i>
                     </button>
                  </div>
                  <div className="instructor__cover-info-right">
                     <Link to="#" className="btn btn-two arrow-btn">
                        Edit Cover Photo
                     </Link>
                  </div>
               </div>
            </div>
         ) : (
            <div
               className="instructor__cover-bg"
               style={{ backgroundImage: `url(/assets/img/bg/features_bg.jpg)` }}
            >
               <div className="instructor__cover-info">
                  <div className="instructor__cover-info-left">
                     <div className="thumb">
                        <img src={user?.profileImage} alt="img" />
                     </div>
                     <button title="Upload Photo">
                        <i className="fas fa-camera"></i>
                     </button>
                  </div>
                  <div className="instructor__cover-info-right">
                     <Link to="#" className="btn btn-two arrow-btn">
                        Edit Cover Photo
                     </Link>
                  </div>
               </div>
            </div>
         )}

         <div className="instructor__profile-form-wrap">
            <form onSubmit={(e) => e.preventDefault()} className="instructor__profile-form">
               <div className="row">
                  <div className="col-md-6">
                     <div className="form-grp">
                        <label htmlFor="firstname">First Name</label>
                        <input id="firstname" type="text" defaultValue={user?.name} />
                     </div>
                  </div>
                  <div className="col-md-6">
                     <div className="form-grp">
                        <label htmlFor="lastname">Last Name</label>
                        <input id="lastname" type="text" defaultValue={user?.surname} />
                     </div>
                  </div>
                  <div className="col-md-6">
                     <div className="form-grp">
                        <label htmlFor="username">User Name</label>
                        <input id="username" type="text" defaultValue={user?.username} />
                     </div>
                  </div>
                  <div className="col-md-6">
                     <div className="form-grp">
                        <label htmlFor="skill">Occupation</label>
                        <input id="skill" type="text" defaultValue="Student" />
                     </div>
                  </div>
                  <div className="col-md-6">
                     <div className="form-grp select-grp">
                        <label htmlFor="displayname">Display Name Publicly As</label>
                        <select id="displayname" name="displayname">
                           <option value="Emily Hannah">{user?.name}</option>
                           <option value="John">{user?.surname}</option>
                           <option value="Due">{user?.name + " " + user?.surname}</option>
                           <option value="Due John">{user?.username}</option>

                        </select>
                     </div>
                  </div>
               </div>
               <div className="form-grp">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                     id="bio"
                     defaultValue= {user?.bio}
                  />
               </div>
               <div className="submit-btn mt-25">
                  <button type="submit" className="btn">
                     Update Info
                  </button>
               </div>
            </form>
         </div>
      </>
   );
};

export default InstructorSettingProfile;
