import { Routes, Route } from 'react-router-dom';
import gamePage from './pages/game';
import signUpPage from './pages/signup';
import startPage from './pages/start';
import NotFoundPage from './pages/notfound';

function App() {
  return (<div>
    <h1>Hello, and welcome to my board game!</h1>
    <h2>Sadly, there's nothing here yet, but it's about to be filled with a game!</h2>
    <Routes>
      <Route path="/" element={<startPage />} />
      <Route path="/game" element={<gamePage />} />
      <Route path="/hub" element={<signUpPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </div>
    );
}

export default App;
