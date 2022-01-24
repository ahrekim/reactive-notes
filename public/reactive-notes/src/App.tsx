import React, { FC, useState } from 'react';
import './App.css';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import Notes from './Notes';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAuth, GoogleAuthProvider, signInWithPopup, Auth } from 'firebase/auth'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { FIREBASE } from './env';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE.apiKey,
  authDomain: FIREBASE.authDomain,
  projectId: FIREBASE.projectId,
  storageBucket: FIREBASE.storageBucket,
  messagingSenderId: FIREBASE.messagingSenderId,
  appId: FIREBASE.appId,
  measurementId: FIREBASE.measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const App: FC = () => {
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);

  auth.onAuthStateChanged(user => {
    setUser(user);
  })

  const login = () => {
    const provider = new GoogleAuthProvider;

    signInWithPopup(auth, provider).then(authData => {
      console.log(authData);
    });
  }

  const logout = () => {
    auth.signOut()
  }
  return (
    <div className="dark:bg-gradient-to-b dark:to-purple-500 dark:via-slate-600 dark:from-slate-900 bg-gradient-to-b to-purple-500 via-stone-200 from-white  min-h-screen">
    <div className="App max-w-prose">
      <div className="grid grid-cols-2 gap-1 mt-2 mb-4">
        <div className="place-self-start">
          <h1 className="text-xl dark:text-white text-slate-900">Reactive notes</h1>
        </div>
        <div className="place-self-end">
        {user ?
          <div className="loggedIn">
            <button
            type="button"
            className="group relative w-full flex justify-center py-2 px-4 text-stone-50 text-sm font-medium rounded-lg bg-opacity-10 shadow-md  bg-gradient-to-tl from-red-600  to-violet-800"
            onClick={logout}
            >
            Logout <br />
            {user.displayName}
            </button>
          </div>
          :
            <button
            type="button"
            className="group relative w-full flex justify-center py-2 px-4 text-stone-50 text-sm font-medium rounded-lg bg-opacity-10 shadow-md  bg-gradient-to-tl from-fuchsia-600  to-violet-800"
            onClick={login}
            >
            Login with Google
            </button>
          }
        </div>
      </div>
      {user ?
      <Notes user={user} firebaseApp={app} />
      : ""}
    </div>
    </div>
  );
}

export default App;
