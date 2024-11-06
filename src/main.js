import './assets/null.css';
import './assets/css/theme.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

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

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

const app = createApp(App);

app.use(router);
const pinia = createPinia();
app.use(pinia);
app.mount('#app');
