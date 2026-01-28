'use client';
// React imports
import React from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '../../server/firebase/auth';

export default function signUpPage() {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const router = useRouter();

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

        <button type="button" className="button" onClick={() => createUser(email, password)}>
          Sign Up
          <div className="arrow-wrapper">
          <div className="arrow"></div>
          </div>
        </button>

        <text onClick={() => router.push('/client/login')}>
          Already have an account? Please log in instead.
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