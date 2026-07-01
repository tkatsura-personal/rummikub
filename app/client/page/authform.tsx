'use client';
import React, { CSSProperties, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, } from 'firebase/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebase";

type Register = 'sign-in' | 'sign-up';

export default function AuthForm() {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [action, setAction] = React.useState<Register>('sign-in');
  const router = useNavigate();
  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  const provider = new GoogleAuthProvider();

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleUserAuthentication = async (email: string, password: string) => {
    if (action == 'sign-in') {
      const signInUser = await signInWithEmailAndPassword(auth, email, password);
      router(`/lobby`);
    } else {
      const signUp = await createUserWithEmailAndPassword(auth, email, password);
      router(`/lobby`);
    }
  }

  const containerStyle: CSSProperties = {
    background: '#f5f0e8',
    border: '1px solid rgba(212, 196, 160, 0.2)',
    borderRadius: '12px',
    padding: '40px 36px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    boxShadow:
      '0 0 0 1px rgba(232, 160, 32, 0.08), 0 24px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
    width: '100%',
    height: '100vh',
    maxHeight: '450px',
    maxWidth: '400px',
    position: 'relative',
  }

  const handleGoogleAuth = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        router(`/lobby`);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage);
      }
    );
  }

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, [action]);

  return (
    <div style = {containerStyle}>
      <h1> { action == 'sign-in'? 'Sign In' : 'Sign Up' } </h1>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder = "Email"
      />

      <input
        type={isVisible? 'Text': 'Password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder = "Password"
      />
      <button className="button" onClick={() => setIsVisible(!isVisible)}>
        { isVisible? 'Hide' : 'Show' } 
      </button>

      <button type="button" className="button" onClick={() => handleUserAuthentication(email, password) }>
        {action == 'sign-in'? 'Log In' : 'Sign Up'}
        <div className="arrow-wrapper">
        <div className="arrow"></div>
        </div>
      </button>

      <button type="button" className="button" onClick={() => handleGoogleAuth() }>
        {action == 'sign-in'? 'Log In with Google' : 'Create an Account with Google'}
        <div className="arrow-wrapper">
        <div className="arrow"></div>
        </div>
      </button>
      
      { action == 'sign-in'? 
        <button type="button" className="button" onClick={() => router('/resetpass')}>
            Forgot Password?
            <div className="arrow-wrapper">
            <div className="arrow"></div>
            </div>
        </button>
        : <></>
      }

      <text onClick={() => action == 'sign-in'? setAction('sign-up') : setAction('sign-in') }>
        { action == 'sign-in'? "Don't have an account? Please sign up instead." : "Already have an account? Sign in here."}
      </text>

      <button type="button" className="button" onClick={() => router('/')}>
          Back
          <div className="arrow-wrapper">
          <div className="arrow"></div>
          </div>
      </button>
    </div>
  )
}