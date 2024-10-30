import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {
  apiKey: "AIzaSyCxerjyDpZNmdVRHp5nn3yXGKk9A0ven-c",
  authDomain: "onlinesgamestores.firebaseapp.com",
  projectId: "onlinesgamestores",
  storageBucket: "onlinesgamestores.firebasestorage.app",
  messagingSenderId: "33456882228",
  appId: "1:33456882228:web:a4bcb05a0606d18c460061"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { db, auth };
