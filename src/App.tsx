import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/ui/HomePage';
import PracticeModePage from './pages/practice/ui/PracticeModePage';
import CodingModePage from './pages/coding/ui/CodingModePage';
import FreeModePage from './pages/free/ui/FreeModePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/practice" element={<PracticeModePage />} />
        <Route path="/coding" element={<CodingModePage />} />
        <Route path="/free" element={<FreeModePage />} />
      </Routes>
    </BrowserRouter>
  );
}
