import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig.ts";

interface User {
    id: string;
    name: string;
    surname: string;
    bio: string;
    profileImage: string;
    email: string;
    username: string;
    favorites: string[]; // Favoriler string dizisi olarak
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Başlangıçta true

    const logout = () => {

        auth.signOut()
        setUser(null); // Kullanıcı durumunu sıfırla


    };

    const login = (userData: User) => {
        setUser(userData);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

            if (firebaseUser) {
                try {
                    const userDocRef = doc(db, "users", firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);


                    if (userDoc.exists()) {
                        const userData = userDoc.data();

                        setUser({
                            id: firebaseUser.uid,
                            name: userData.name || "User",
                            surname: userData.surname || "User",
                            bio: userData.bio || "User",
                            profileImage: userData.image_url || "https://via.placeholder.com/150",
                            email: userData.email || "",
                            username: userData.username || "Unknown",
                            favorites: userData.favorites || [],
                    });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                // Kullanıcı giriş yapmamış
                setUser(null);
            }
            setLoading(false); // Oturum durumu belirlendiğinde loading'i false yapıyoruz
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
