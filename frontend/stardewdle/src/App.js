import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { SoundProvider } from "./context/SoundContext";

import './App.css';

import Landing from "./pages/Landing";
import Game from "./pages/Game";
import Collections from "./pages/Collections";
import Test from "./pages/Test";

export default function App() {
  return (
    <SoundProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<Game />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
    </SoundProvider>
  );
}
