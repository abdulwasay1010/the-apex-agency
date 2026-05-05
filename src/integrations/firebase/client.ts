import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDvEWBBP1lTfXymrxnqwMaBJ6HSSteVzrY",
  authDomain: "theapexagency.firebaseapp.com",
  projectId: "theapexagency",
  storageBucket: "theapexagency.firebasestorage.app",
  messagingSenderId: "117028489178",
  appId: "1:117028489178:web:5e90ade014bb8be80662e3",
  measurementId: "G-PWVRZ9MZR3",
};

export const ADMIN_EMAILS = ["wasayasad@gmail.com"];

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (_app) return _app;
  _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (_auth) return _auth;
  _auth = getAuth(getFirebaseApp());
  return _auth;
}

export function getDb(): Firestore {
  if (_db) return _db;
  _db = getFirestore(getFirebaseApp());
  return _db;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (_storage) return _storage;
  _storage = getStorage(getFirebaseApp());
  return _storage;
}
