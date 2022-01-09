import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { getUser } from './data/data';
import { User } from './models/user';
import { Note } from './models/note';
import { getAuth, GoogleAuthProvider, signInWithPopup, Auth } from 'firebase/auth'



function Home(){
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
    <div className="homepage">
      <h2>Home</h2>
      {user ?
        <button
        type="button"
        className="group relative w-full flex justify-center py-2 px-4 text-stone-50 text-sm font-medium rounded-lg bg-opacity-10 shadow-md  bg-gradient-to-tl from-red-600  to-violet-800"
        onClick={logout}
        >
        Logout
        </button>
      :
        <button
        type="button"
        className="group relative w-full flex justify-center py-2 px-4 text-stone-50 text-sm font-medium rounded-lg bg-opacity-10 shadow-md  bg-gradient-to-tl from-fuchsia-600  to-violet-800"
        onClick={login}
        >
        Login
        </button>
      }
    </div>

  );
}

export default Home;
