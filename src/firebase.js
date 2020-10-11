import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBUuAwmRxuRE2DxL251-GZ9_V1Kg3auvEo",
    authDomain: "cp-instagram-clone-65bd8.firebaseapp.com",
    databaseURL: "https://cp-instagram-clone-65bd8.firebaseio.com",
    projectId: "cp-instagram-clone-65bd8",
    storageBucket: "cp-instagram-clone-65bd8.appspot.com",
    messagingSenderId: "956173477105",
    appId: "1:956173477105:web:a1177fe18bca57b65e3550",
    measurementId: "G-JE1HL3E2RM"
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };