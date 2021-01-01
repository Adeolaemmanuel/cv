import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/storage'

firebase.initializeApp({
    apiKey: "AIzaSyBVRjp-rSXg8oZF-6dv61_xkSlJY0arQMg",
    authDomain: "cv-cms-39619.firebaseapp.com",
    projectId: "cv-cms-39619",
    storageBucket: "cv-cms-39619.appspot.com",
    messagingSenderId: "628822117289",
    appId: "1:628822117289:web:de7614d4ebefa6dfe3d2b8",
    measurementId: "G-PKCP28FXQD"
})

const db = firebase.firestore()
const storage = firebase.storage()


export { db, firebase, storage }