import firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp({
   apiKey: "",
   authDomain: "",
   databaseURL: "",
   projectId: "",
   storageBucket: "",
   messagingSenderId: "",
   appId: "",
   measurementId: "",
});

export const firebaseApp = firebase;
