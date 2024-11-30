import React, { createContext, useState, useEffect } from 'react';
import { observeAuthState } from '../firebase/firebaseUtils';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = observeAuthState((firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                });
            } else {
                setUser(null);
            }
        });
        return unsubscribe;
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
