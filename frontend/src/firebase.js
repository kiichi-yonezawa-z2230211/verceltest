import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCIyW0CRjWK7QUlEqQgEfa-acd0onwK1M8",
  authDomain: "test1-384bd.firebaseapp.com",
  projectId: "test1-384bd",
  storageBucket: "test1-384bd.firebasestorage.app",
  messagingSenderId: "715020820855",
  appId: "1:715020820855:web:1fa1634315c60caa28c172",
  measurementId: "G-2F29HYW3HV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
