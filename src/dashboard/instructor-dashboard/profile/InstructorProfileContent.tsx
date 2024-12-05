import {useAuth} from "../../../firebase/AuthContext.tsx";

const InstructorProfileContent = () => {

   const {user} = useAuth();

   return (
      <div className="col-lg-9">
         <div className="dashboard__content-wrap">
            <div className="dashboard__content-title">
               <h4 className="title">My Profile</h4>
            </div>
            <div className="row">
               <div className="col-lg-12">
                  <div className="profile__content-wrap">
                     <ul className="list-wrap">
                        <li><span>Name and Surname</span> {user?.name} </li>
                        <li><span>Username</span> {user?.username}</li>
                        <li><span>Email</span> {user?.email}</li>
                        <li><span>Occupation</span> Student</li>
                        <li><span>Biography</span>{user?.bio}</li>
                     </ul>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default InstructorProfileContent
