'use client';
import { useRouter } from 'next/navigation';
import Heading from "./Heading";
import './globals.css';



export default function Page() {
  const router = useRouter();
  
  return (
    <div>
      <Heading title = {"Welcome to my Rummikub Project!"}/>
      <h1>Hello, and welcome to my board game!</h1>
      <h3>Sadly, there's nothing here yet, but it's about to be filled with a game!</h3>
      <button type="button" onClick={() => router.push('./client/game.tsx')}>
        Play Game
      </button>

      <button type="button" onClick={() => router.push('./client/login.tsx')}>
        Sign In
      </button>

      <button type="button" onClick={() => router.push('./client/signup.tsx')}>
        Sign Up
      </button>
    </div>
  )
}
