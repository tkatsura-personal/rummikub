'use client';
// React imports
import React from 'react';

export default function signUpPage() {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <>
      <div>
        <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder = "Email"
         />

         <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder = "Password"
         />

         <button type="button" className="button" onClick={() => loginUser(email, password)}>
            Log In
            <div className="arrow-wrapper">
            <div className="arrow"></div>
            </div>
        </button>

        <button type="button" className="button" onClick={() => router.push('/client/resetpass')}>
            Forgot Password?
            <div className="arrow-wrapper">
            <div className="arrow"></div>
            </div>
        </button>

        <text onClick={() => router.push('/client/signup')}>
          Don't have an account? Please sign up instead.
        </text>

        <button type="button" className="button" onClick={() => router.push('/')}>
            Back
            <div className="arrow-wrapper">
            <div className="arrow"></div>
            </div>
        </button>
      </div>
    </>
  )

}