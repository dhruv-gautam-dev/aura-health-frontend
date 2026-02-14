import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCLidXjK79MVeKPcQ9W-T2MJK9TQafeuWQ",
  authDomain: "health-buddy-99cc8.firebaseapp.com",
  projectId: "health-buddy-99cc8",
  storageBucket: "health-buddy-99cc8.firebasestorage.app",
  messagingSenderId: "604563190679",
  appId: "1:604563190679:web:da4ac1fb77eeb72df64ad2",
  measurementId: "G-Y9MV822MEL"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);



// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCLidXjK79MVeKPcQ9W-T2MJK9TQafeuWQ",
//   authDomain: "health-buddy-99cc8.firebaseapp.com",
//   projectId: "health-buddy-99cc8",
//   storageBucket: "health-buddy-99cc8.firebasestorage.app",
//   messagingSenderId: "604563190679",
//   appId: "1:604563190679:web:da4ac1fb77eeb72df64ad2",
//   measurementId: "G-Y9MV822MEL"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);