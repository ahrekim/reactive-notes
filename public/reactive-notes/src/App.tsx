import React, { FC } from 'react';
import './App.css';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import Auth from './Auth';
import Notes from './Notes';
import 'bootstrap/dist/css/bootstrap.min.css';



const App: FC = () => {
  return (
    <div className="App">
      <h1>Reactive notes</h1>
      <div className="nav">
        <Link className="nav-link" to="/">Auth</Link>
        <Link className="nav-link" to="/notes">Notes</Link>
      </div>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="notes" element={<Notes />} />
      </Routes>
    </div>
  );
}

export default App;
