import { Routes, Route } from 'react-router-dom';
import gamePage from './pages/game';
import signUpPage from './pages/signup';
import startPage from './pages/start';
import NotFoundPage from './pages/notfound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<startPage />} />
      <Route path="/game" element={<gamePage />} />
      <Route path="/hub" element={<signUpPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
