import { Link, useNavigate } from "react-router-dom"
import LoginForm from "../../../forms/LoginForm"
import {doc, getDoc} from "firebase/firestore";


import { signInWithPopup } from "firebase/auth";

import {auth, db, googleProvider} from "../../../firebase/firebaseConfig";





const LoginArea = () => {
    const navigate = useNavigate();
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Firestore'da kullanıcıyı kontrol et
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {

                //alert("Google ile giriş başarılı!");
                navigate(`/student-profile/${user.uid}`);
            } else {
                console.log("Kullanıcı bulunamadı, kayıt gerekebilir.");
                alert("Kayıtlı bir kullanıcı bulunamadı. Lütfen önce kaydolun.");
            }
        } catch (error) {
            console.error("Google ile giriş hatası:", error);
            alert("Google ile giriş başarısız oldu!");
        }
    };

   return (
      <section className="singUp-area section-py-120">
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-xl-6 col-lg-8">
                  <div className="singUp-wrap">
                     <h2 className="title">Welcome back!</h2>
                     <p>Hey there! Ready to log in? Just enter your username and password below and you&apos;ll be back
                        in action in no time. Let&apos;s go!</p>
                     {/*<div className="account__social">

                           <button
                               onClick={handleGoogleLogin}
                               className="account__social-btn"
                               style={{
                                  width: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                               }}
                           >
                              <img src="/assets/img/icons/google.svg" alt="img"/>
                              Continue with Google
                           </button>



                     </div>
                     <div className="account__divider">
                        <span>or</span>
                     </div>*/}
                     <LoginForm/>
                     <div className="account__switch">
                        <p>Don&apos;t have an account?<Link to="/registration">Sign Up</Link></p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}

export default LoginArea
