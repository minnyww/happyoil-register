import firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp({
   apiKey: "AIzaSyBg0LK0eKK8rorYdvL8vw5cgmoV3hUZmeg",
   authDomain: "chayen.firebaseapp.com",
   databaseURL: "https://chayen.firebaseio.com",
   projectId: "chayen",
   storageBucket: "chayen.appspot.com",
   messagingSenderId: "562614183093",
   appId: "1:562614183093:web:1ac671d1000f49b9ee4afc",
   measurementId: "G-DJKHWJEEM6",
});

export const firebaseApp = firebase;
