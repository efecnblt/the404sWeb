import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebaseConfig";

// Fetch documents from a Firestore collection
export const fetchCollection = async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

// Observe authentication state changes
export const observeAuthState = (callback) => {
    onAuthStateChanged(auth, callback);
};
