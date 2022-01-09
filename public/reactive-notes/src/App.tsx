import React, { FC } from 'react';
import './App.css';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import Auth from './Auth';
import Notes from './Notes';
import 'bootstrap/dist/css/bootstrap.min.css';



const App: FC = () => {
  return (
    <div className="bg-gradient-to-br to-purple-500 via-slate-600 from-slate-900 min-h-screen">
    <div className="App max-w-prose">
      <h1 className="text-4xl text-sky-500 font-light">Reactive notes</h1>
      <div className="nav">
        <Link className="text-sky-500 hover:text-fuchsia-600 ml-1 mr-4" to="/">Auth</Link>
        <Link className="text-sky-500 hover:text-fuchsia-600 mr-4" to="/notes">Notes</Link>
      </div>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="notes" element={<Notes />} />
      </Routes>
    </div>
    </div>
  );
}

export default App;
