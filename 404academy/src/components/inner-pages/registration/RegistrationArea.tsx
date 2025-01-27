import { Link } from "react-router-dom"
import RegistrationForm from "../../../forms/RegistrationForm"
import {signInWithPopup} from "firebase/auth";


import {auth, db, googleProvider} from "../../../firebase/firebaseConfig.ts";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {toast} from "react-toastify";


const RegistrationArea = () => {


   const handleGoogleRegister = async () => {
      try {


         const result = await signInWithPopup(auth, googleProvider);
         const user = result.user;
         const firebaseUID = user.uid;


         // İsim ve soy isim ayrıştırma
         const displayNameParts = user.displayName ? user.displayName.split(" ") : ["Google", "User"];
         const name = displayNameParts[0] || "Google";
         const surname = displayNameParts[1] || "User";


         // Rastgele bir kullanıcı adı oluşturma
         // Örneğin "john.doe_x1z2" gibi
         const randomString = Math.random().toString(36).substring(2, 6);
         const username = `${name}.${surname}_${randomString}`.toLowerCase();

         // Firestore'da kullanıcı dökümanını kontrol et
         const userDocRef = doc(db, "users", firebaseUID);
         const userDoc = await getDoc(userDocRef);

         if (userDoc.exists()) {
            // Kullanıcı zaten kayıtlı. (Dilerseniz direkt giriş yapma işlemine yönlendirebilirsiniz)
            toast.error("Bu e-posta zaten kayıtlı. Lütfen giriş yapın.");
            await auth.signOut();
         } else {

            // Kayıt: İsim, soy isim ayrı tutma + rastgele username + varsayılan bio + occupation
            await setDoc(userDocRef, {
               id: firebaseUID,
               name: name,
               surname: surname,
               email: user.email || "",
               image_url: user.photoURL || "",
               createdAt: new Date(),
               username: username,
               bio: "Hey there! I’m new here. This is my default bio.",
               occupation: "Student"
            });

            // Backend'e kayıt (AuthController üzerinden)
            const firstName = user.displayName ? user.displayName.split(" ")[0] : "Google";
            // Soyad kısmı yoksa "User" olarak ayarlayalım
            const lastName = user.displayName && user.displayName.split(" ")[1]
                ? user.displayName.split(" ")[1]
                : "User";

            // Google ile kayıt olan kullanıcının parolası normalde yoktur.
            // Backend’iniz password gerektiriyorsa rasgele bir parola oluşturabilirsiniz:
            const randomPassword = Math.random().toString(36).slice(-8);

            const response = await fetch('http://165.232.76.61:5001/api/Auth/register', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                  email: user.email,
                  password: randomPassword,
                  firstName: firstName,
                  lastName: lastName,
                  role: "Student",        // Varsayılan rol
                  firebaseUID: firebaseUID,  // Firebase'den alınan UID
               }),
            });

            const resultData = await response.json();

            if (response.ok) {
               toast.success("Google ile kayıt başarılı! Lütfen giriş yapın.");
            } else {
               console.error("API Error:", resultData.message);
               toast.error(`API Error: ${resultData.message || 'Registration failed'}`);
            }

            // Google ile kayıt tamamlandıktan sonra dilerseniz
            // tekrar signOut ederek kullanıcıdan normal login isteyebilirsiniz:
            await auth.signOut();
         }
      } catch (error: any) {
         console.error("Google ile kayıt hatası:", error);
         toast.error("Google ile kayıt başarısız oldu!");
      }
   };


   return (
       <section className="singUp-area section-py-120">
          <div className="container">
             <div className="row justify-content-center">
                <div className="col-xl-6 col-lg-8">
                   <div className="singUp-wrap">
                      <h2 className="title">Create Your Account</h2>
                      <p>Hey there! Ready to join the party? We just need a few details from you to get <br/> started.
                         Let&apos;s do this!</p>
                      {/*<div className="account__social">
                         <button
                             onClick={handleGoogleRegister}
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
                      <RegistrationForm/>
                      <div className="account__switch">
                         <p>Already have an account?<Link to="/login">Login</Link></p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </section>
   )

}

export default RegistrationArea
