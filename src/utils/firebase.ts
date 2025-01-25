import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyCphN65fW6TXyMu3fSxGYUqY1s2eUaKrFU",
    authDomain: "material-ui-45050.firebaseapp.com",
    projectId: "material-ui-45050",
    storageBucket: "material-ui-45050.firebasestorage.app",
    messagingSenderId: "672635341068",
    appId: "1:672635341068:web:c2372bc8202d16c23f6129"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);