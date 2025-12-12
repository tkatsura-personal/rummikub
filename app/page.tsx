'use client';

import { StrictMode } from 'react';
import { useRouter } from 'next/router';
import Signup from './client/signup';
import Pagenotfound from "./client/notfound";
import Login from './client/login';
import Heading from "./Heading";
import './globals.css';



export default function Page() {
  const router = useRouter()
  
  return (
    <StrictMode>
      <div>
        <Heading title = {"Welcome to my Rummikub Project!"}/>
        <h1>Hello, and welcome to my board game!</h1>
        <h3>Sadly, there's nothing here yet, but it's about to be filled with a game!</h3>
        <Signup/>
        <Pagenotfound/>
        <Login/>
      </div>
    </StrictMode>
  )
}
