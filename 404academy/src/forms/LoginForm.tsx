import { toast } from 'react-toastify';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import BtnArrow from '../svg/BtnArrow';
import {Link, useNavigate} from 'react-router-dom';
import { setPersistence, browserSessionPersistence , signInWithEmailAndPassword } from "firebase/auth"; // Ensure firebase/auth is installed
import {auth, db} from "../firebase/firebaseConfig";
import { useAuth } from "../firebase/AuthContext";

import {useState} from "react";
import {doc, getDoc} from "firebase/firestore"; // Adjust the path to your Firebase config



interface FormData {
   email: string;
   password: string;
}

const LoginForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { login } = useAuth();

   const schema = yup
      .object({
         email: yup.string().required().email().label("Email"),
         password: yup.string().required().label("Password"),
      })
      .required();

   const { register, handleSubmit, formState: { errors }, } = useForm<FormData>({ resolver: yupResolver(schema), });

    // Login işlemi
    const handleLogin = async (data: FormData) => {
        setError("");
        setLoading(true);

        try {
            // Tarayıcı oturumunu belirle
            await setPersistence(auth, browserSessionPersistence);

            // Firebase oturum açma işlemi
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;

            // Firestore’dan kullanıcı verilerini al
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();

                // Kullanıcıyı login et
                login({
                    id: user.uid,
                    name: userData.name || "User",
                    profileImage: userData.image_url || "https://via.placeholder.com/150",
                    email: userData.email || "",
                    username: userData.username || "Unknown",
                    favorites: userData.favorites || [],
                });

                toast.success("Login successful!", { position: "top-center" });
                navigate("/student-dashboard/" + user.uid); // Kullanıcıyı dashboard’a yönlendir
            } else {
                setError("User data not found in Firestore.");
            }
        } catch (err: any) {
            // Hata yönetimi
            if (err.code === "auth/user-not-found") {
                setError("No user found with this email.");
            } else if (err.code === "auth/wrong-password") {
                setError("Incorrect password. Please try again.");
            } else {
                setError("An error occurred. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

   return (
      <form onSubmit={handleSubmit(handleLogin)} className="account__form">
          {error && <p className="form_error">{error}</p>} {/* Display error message */}
         <div className="form-grp">
            <label htmlFor="email">Email</label>
            <input id="email" {...register("email")} type="text" placeholder="email" />
            <p className="form_error">{errors.email?.message}</p>
         </div>
         <div className="form-grp">
            <label htmlFor="password">Password</label>
            <input id="password" {...register("password")} type="password" placeholder="password" />
            <p className="form_error">{errors.password?.message}</p>
         </div>
         <div className="account__check">
            <div className="account__check-remember">
               <input type="checkbox" className="form-check-input" value="" id="terms-check" />
               <label htmlFor="terms-check" className="form-check-label">Remember me</label>
            </div>
            <div className="account__check-forgot">
               <Link to="/registration">Forgot Password?</Link>
            </div>
         </div>
         <button type="submit" className="btn btn-two arrow-btn"
                 disabled={loading} // Disable button while loading
         >{loading ? 'Logging In...' : 'Log In'}<BtnArrow /></button>
      </form>
   )
}

export default LoginForm
