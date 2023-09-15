// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByG1vy6IPUaHrnsvGCWnlwJQMD_Qaofa4",
  authDomain: "fitnessapp-ba718.firebaseapp.com",
  projectId: "fitnessapp-ba718",
  storageBucket: "fitnessapp-ba718.appspot.com",
  messagingSenderId: "757968853377",
  appId: "1:757968853377:web:041d617e80355bd86b7080",
  measurementId: "G-XWDGXJMFN7"
};

// Initialize Firebase


export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
