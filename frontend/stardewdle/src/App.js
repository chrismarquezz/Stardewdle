import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { SoundProvider } from "./context/SoundContext";


import './App.css'; // or App.css

import Landing from "./pages/Landing";
import Game from "./pages/Game";
import Collections from "./pages/Collections";

export default function App() {
  return (
    <SoundProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<Game />} />
        <Route path="/collections" element={<Collections />} />
      </Routes>
    </Router>
    </SoundProvider>
  );
}
