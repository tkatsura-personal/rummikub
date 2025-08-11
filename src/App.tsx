import { useState } from 'react'
import { useEffect } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { db } from "./lib/firebase";
import { collection, getDocs } from "firebase/firestore";

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    async function testConnection() {
      try {
        const snapshot = await getDocs(collection(db, "test"));
        console.log(
          "✅ Firebase connected:",
          snapshot.empty ? "No docs found" : `${snapshot.size} docs found`
        );
        snapshot.forEach(doc => {
          console.log("📄 Doc:", doc.id, doc.data());
        });
      } catch (err) {
        console.error("❌ Firebase error:", err);
      }
    }
    testConnection();
  }, []);


  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div className="p-4" draggable={true} onDragStart={e => console.log('onDragStart')} onDragEnd={e => console.log('onDragEnd')}>
        <h1 className="text-xl font-bold">Rummikub Firebase Test</h1>
        <p>Check the browser console for results.</p>
      </div>
    </>
  )
}

export default App;
