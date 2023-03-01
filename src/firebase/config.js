// Import necessary modules
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyARSIHPGz0rqAZBzNkoybKy9rgdwzBhsi4",
  authDomain: "project-zen-2023.firebaseapp.com",
  projectId: "project-zen-2023",
  storageBucket: "project-zen-2023.appspot.com",
  messagingSenderId: "644307187768",
  appId: "1:644307187768:web:b6733c94499f9c939d8ecd",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();

// Firebase timestamp
const timestamp = firebase.firestore.Timestamp;

// Export Firebase services and timestamp
export { projectFirestore, projectAuth, timestamp, projectStorage };