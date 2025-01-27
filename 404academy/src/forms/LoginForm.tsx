import { toast } from 'react-toastify';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import BtnArrow from '../svg/BtnArrow';
import {Link, useNavigate} from 'react-router-dom';
import { setPersistence, browserSessionPersistence , signInWithEmailAndPassword } from "firebase/auth"; // Ensure firebase/auth is installed
import {auth} from "../firebase/firebaseConfig";
import { useAuth } from "../firebase/AuthContext";

import { useState} from "react";
import axios from "axios";
import { Mosaic } from "react-loading-indicators";


interface FormData {
    email: string;
    password: string;
}

interface UserApiResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    passwordSalt: string;
    passwordHash: string;
    status: boolean;
    firebaseUID: string;
    username: string;
    biography: string;
    imageUrl: string;
}

const LoginForm = () => {
    const [loading, setLoading] = useState(false);
    const [roleLoading, setRoleLoading] = useState(false);
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
        setRoleLoading(true);

        try {
            // Firebase authentication
            await setPersistence(auth, browserSessionPersistence);
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            const firebaseUser = userCredential.user;

            // Get user data from API
            try {
                const userResponse = await axios.get<UserApiResponse>(
                    `http://165.232.76.61:5001/api/Users/getbyfirebaseuid/${firebaseUser.uid}`
                );
                const userData = userResponse.data;

                // Get user claims using the ID from API response
                const claimsResponse = await axios.get(
                    `http://165.232.76.61:5001/api/Users/getclaims/${userData.id}`
                );
                const claims = claimsResponse.data;

                // Login with combined data
                await login({
                    id: userData.id.toString(), // Use API ID instead of Firebase UID
                    name: userData.firstName,
                    surname: userData.lastName,
                    bio: userData.biography,
                    imageUrl: userData.imageUrl,
                    email: userData.email,
                    username: userData.username,
                    favorites: [], // Set default or fetch from another source if needed
                    claims: claims,
                });

                toast.success("Login successful!", { position: "top-center" });

                // Check role and navigate
                const isAuthor = claims.some(
                    (claim: any) => claim.id === 3 && claim.name === "Author"
                );

                if (isAuthor) {
                    navigate(`/instructor-profile/${userData.id}`);
                } else {
                    navigate(`/student-dashboard/${userData.id}`);
                }

            } catch (apiError) {
                console.error("API Error:", apiError);
                setError("Error fetching user data. Please try again.");
            }

        } catch (err: any) {
            if (err.code === "auth/user-not-found") {
                setError("No user found with this email.");
            } else if (err.code === "auth/wrong-password") {
                setError("Incorrect password. Please try again.");
            } else {
                console.error("Login error:", err);
                setError("An error occurred. Please try again later.");
            }
        } finally {
            setLoading(false);
            setRoleLoading(false);
        }
    };

    return (
        <>
            {(loading || roleLoading) && (
                <div className="loading-overlay">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100vh",
                            backgroundColor: "#f9f9f9",
                        }}
                    >
                        <Mosaic color={["#33CCCC", "#33CC36", "#B8CC33", "#FCCA00"]}/>
                    </div>
                    <p>{loading ? 'Logging in...' : 'Checking permissions...'}</p>
                </div>
            )}

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
        </>
    )
}

export default LoginForm
