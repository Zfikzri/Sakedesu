import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/home/Home';
import DetailAnime from './pages/detail/DetailAnime';
import Manga from './pages/manga/Manga';
import DetailManga from './pages/detail/DetailManga';
import Character from './pages/character/Character';
import DetailCharacter from './pages/detail/DetailCharacter';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-gray-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/anime/:id" element={<DetailAnime />} />
            <Route path="/manga" element={<div className="min-h-screen flex items-center justify-center text-white text-2xl pt-10"><Manga/></div>} />
            <Route path="/manga/:id" element={<DetailManga />} />
            <Route path="/characters" element={<div className="min-h-screen flex items-center justify-center text-white text-2xl pt-10"><Character/></div>} />
            <Route path="/character/:id" element={<DetailCharacter/>}/>
            
            {/* 404 fallback */}
            <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-white text-2xl">Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;