import React, {createContext, useContext, useState, useEffect} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./firebaseConfig.ts";
import {useDispatch} from "react-redux";
import {clear_cart} from "../redux/features/cartSlice";
import { fetchWishlist, clearWishlist } from "../redux/features/wishlistSlice";
import axios from "axios";
import { signOut } from "firebase/auth";
import {toast} from "react-toastify";
import {encodeId} from "./idEncoder.ts";
import { Mosaic } from "react-loading-indicators";


interface Claim {
    id: number;   // 1 => Admin, 2 => User, 3 => Author, 4 => Student, vb.
    name: string; // "Admin", "Author", vb.
}

interface User {
    id: number;
    firebaseUid: string;
    name: string;
    surname: string;
    bio: string;
    imageUrl: string;
    email: string;
    username: string;
    studentId: number, // Students tablosundaki ID
    encodedStudentId: string,
    claims?: Claim[]; // --- YENİ: Kullanıcının sahip olduğu rol(ler)
}


interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    startRegistration: () => void; // Yeni eklenen metod
    endRegistration: () => void;   // Yeni eklenen metod
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const useAuth = () => {

    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [claimsLoading, setClaimsLoading] = useState<boolean>(false);
    const [isRegistration, setIsRegistration] = useState<boolean>(false); // Kayıt süreci kontrolü

    const dispatch = useDispatch();

    const logout = async () => {

        try {
            // Firebase oturumunu kapat
            await signOut(auth);
            setUser(null);

            dispatch(clear_cart());
            dispatch(clearWishlist());

            toast.success("Successfully logged out!", { position: "top-center" });
        } catch (error) {
            console.error("Error during logout:", error);
            toast.error("Failed to log out. Please try again.", { position: "top-center" });
        }

    };

    const login = (userData: User) => {

        setUser(userData);
    };

    const startRegistration = () => {
        setIsRegistration(true);
    };

    const endRegistration = () => {
        setIsRegistration(false);
    };


    // Kullanıcıyı localStorage'da saklama
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

// Kullanıcıyı localStorage'dan geri yükleme
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);


    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoading(true);
            if (firebaseUser) {
                try {
                    setClaimsLoading(true);
                    const firebaseUID = firebaseUser.uid;

                    // Fetch all data in parallel
                    const [userResponse, studentsResponse] = await Promise.all([
                        axios.get(`http://165.232.76.61:5001/api/Users/getbyfirebaseuid/${firebaseUID}`),
                        axios.get(`http://165.232.76.61:5001/api/Students`),

                    ]);

                    const userData = userResponse.data;
                    const claimsResponse = await axios.get(`http://165.232.76.61:5001/api/Users/getclaims/${userData.id}`)
                    const studentData = studentsResponse.data.find(
                        (student: any) => student.userId === userData.id
                    );
                    const userClaims = claimsResponse.data;

                    if (!studentData) {
                        console.error("Student record not found");
                        setUser(null);
                        return;
                    }

                    const formattedUser: User = {
                        id: userData.id,
                        firebaseUid: firebaseUID,
                        name: userData.firstName,
                        surname: userData.lastName,
                        bio: userData.biography,
                        imageUrl: userData.imageUrl,
                        email: userData.email,
                        username: userData.username,
                        studentId: studentData.studentId,
                        encodedStudentId: encodeId(studentData.studentId),
                        claims: userClaims,
                    };

                    setUser(formattedUser);
                    await dispatch(fetchWishlist(studentData.studentId));
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUser(null);
                } finally {
                    setClaimsLoading(false);
                }
            } else {
                setUser(null);
                dispatch(clearWishlist());
            }
            setLoading(false);
        });

        return () => unsubscribeAuth();
    }, [dispatch]);

    // Show loading state while either main loading or claims loading is active
    if (loading || claimsLoading) {
        return (
            <div className="loading-overlay">
                <Mosaic color={["#33CCCC", "#33CC36", "#B8CC33", "#FCCA00"]} />
                <p>{loading ? 'Loading...' : 'Checking permissions...'}</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{user, loading: loading || claimsLoading, login, logout, startRegistration, endRegistration}}>
            {children}
        </AuthContext.Provider>
    );
};
