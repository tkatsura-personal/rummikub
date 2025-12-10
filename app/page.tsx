'use client';

import { StrictMode } from 'react';
//import { BrowserRouter as Router } from 'react-router-dom';
//import { Routes, Route } from 'react-router-dom';
//import AuthPage from "./server/firebase/auth";
//<Route path="/auth" element={<AuthPage/>}/>
//import game from './components/game/page';
//import SignUpPage from './components/signup/page';
//import StartPage from './components/page';
//import NotFoundPage from './components/notfound/page';
import Heading from "./Heading";
import './globals.css';

export default function Page() {
  return (
    <StrictMode>
      <div>
        <Heading title = {"Welcome to my Rummikub Project!"}/>
        <h1>Hello, and welcome to my board game!</h1>
        <h3>Sadly, there's nothing here yet, but it's about to be filled with a game!</h3>
      </div>
    </StrictMode>
  )
}
