import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element with id 'root' not found. Please ensure there is a div with id='root' in your index.html.");
}
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);

// import { Routes, Route } from 'react-router-dom';
// import gamePage from './pages/game';
// import signUpPage from './pages/signup';
// import startPage from './pages/start';
// import NotFoundPage from './pages/notfound';
// import Heading from "./client/components/Heading"

// function App() {
//   return (
//   <div>
//     <Heading title = {"Welcome to my Rummikub Project!"}/>
//     <h1>Hello, and welcome to my board game!</h1>
//     <h2>Sadly, there's nothing here yet, but it's about to be filled with a game!</h2>
//     <Routes>
//       <Route path="/" element={<startPage />} />
//       <Route path="/game" element={<gamePage />} />
//       <Route path="/hub" element={<signUpPage />} />
//       <Route path="*" element={<NotFoundPage />} />
//     </Routes>
//   </div>
//     );
// }

// export default App;
