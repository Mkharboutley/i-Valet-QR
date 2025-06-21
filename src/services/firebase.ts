import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';

// Firebase configuration using environment variables
const firebaseConfig = {
   apiKey: "AIzaSyCZjbRXBSC8aPL8hltxwLsz2v_ytogH4CE",
   authDomain: "i-valet-qr-666.firebaseapp.com",
   databaseURL: "https://i-valet-qr-666-default-rtdb.firebaseio.com",
   projectId: "i-valet-qr-666",
   storageBucket: "i-valet-qr-666.firebasestorage.app",
   messagingSenderId: "668007752772",
   appId: "1:668007752772:web:d112da7a0f1a323c554811",
   measurementId: "G-748WJFF0MZ"
};
let app: FirebaseApp;
let firestore: Firestore;
let storage: FirebaseStorage;
let realtimeDb: Database;
let auth: Auth;

// Firebase app initialization
export const initializeFirebase = () => {
  try {
    app = initializeApp(firebaseConfig);
    firestore = getFirestore(app);
    storage = getStorage(app);
    realtimeDb = getDatabase(app);
    auth = getAuth(app);
    
    console.log('Firebase initialized successfully');
    return app;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

// Export Firebase services
export const getFirestoreInstance = () => {
  if (!firestore) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return firestore;
};

export const getStorageInstance = () => {
  if (!storage) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return storage;
};

export const getRealtimeDbInstance = () => {
  if (!realtimeDb) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return realtimeDb;
};

export const getAuthInstance = () => {
  if (!auth) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return auth;
};

export default initializeFirebase;