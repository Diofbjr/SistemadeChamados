import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
  apiKey: "AIzaSyBa4YthQIkKqtflm3CkYqy7IKnES2hrzhw",
  authDomain: "sistema-9c798.firebaseapp.com",
  projectId: "sistema-9c798",
  storageBucket: "sistema-9c798.appspot.com",
  messagingSenderId: "1072292894251",
  appId: "1:1072292894251:web:af19315f6cfffed140bc6e",
  measurementId: "G-80C4DN2FX8"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase;