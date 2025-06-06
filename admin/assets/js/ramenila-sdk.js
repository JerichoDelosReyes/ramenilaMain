import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    validatePassword,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    getDocs,
    getDoc,
    query,
    where,
    arrayUnion
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const appCredential = initializeApp(firebaseConfig);
const auth = getAuth(appCredential);
const ramenilaDB = getFirestore(appCredential);

export {
    appCredential,
    getAuth,
    auth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    validatePassword,
    signOut,
    getFirestore,
    ramenilaDB,
    doc,
    setDoc,
    addDoc,
    deleteDoc,
    updateDoc,
    getDocs,
    getDoc,
    collection,
    query,
    where,
    arrayUnion,
    updateProfile
};
export const analytics = getAnalytics(appCredential);