import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
//import { BrowserRouter as Router } from 'react-router-dom';
//import { Routes, Route } from 'react-router-dom';
//import AuthPage from "./server/firebase/auth";
//<Route path="/auth" element={<AuthPage/>}/>
import GamePage from './components/game/page';
import SignUpPage from './components/signup/page';
import StartPage from './components/page';
import NotFoundPage from './components/notfound/page';
import Heading from "./components/Heading";
import './globals.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element with id 'root' not found. Please ensure there is a div with id='root' in your index.html.");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <div>
      <Heading title = {"Welcome to my Rummikub Project!"}/>
      <h1>Hello, and welcome to my board game!</h1>
      <h2>Sadly, there's nothing here yet, but it's about to be filled with a game!</h2>
    </div>
  </StrictMode>
);