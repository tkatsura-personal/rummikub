'use client';
import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { linkWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, } from 'firebase/auth';
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
      const changeName = await signInWithEmailAndPassword(auth, email, password);
      console.log(changeName);
    } else {
      const paint = await createUserWithEmailAndPassword(auth, email, password);
      console.log(paint);
    }
  }

  const handleGoogleAuth = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        router(`/lobby/${user.uid}`);
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
    <div>
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
        <button type="button" className="button" onClick={() => router('/client/resetpass')}>
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