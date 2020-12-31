import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/storage'

firebase.initializeApp({
    apiKey: "AIzaSyBN6AeXW2MNMXkCrW7MMzUFAOoif4hjoFs",
    authDomain: "portal-9825f.firebaseapp.com",
    projectId: "portal-9825f",
    storageBucket: "portal-9825f.appspot.com",
    messagingSenderId: "305165741796",
    appId: "1:305165741796:web:fb74ca50805af88ea586f1",
    measurementId: "G-0QBDKE2R71"
})

const db = firebase.firestore()
const storage = firebase.storage()


export { db, firebase, storage }