// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "discusssion-app.firebaseapp.com",
  projectId: "discusssion-app",
  storageBucket: "discusssion-app.appspot.com",
  messagingSenderId: "508986019096",
  appId: "1:508986019096:web:ec2dde6dc763bbaa30226d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export default app;