import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import './App.css'; // or App.css

import Landing from "./pages/Landing";
import Farm from "./pages/Collections";
import CropsDaily from "./pages/CropsDaily";
import CropsRandom from "./pages/CropsRandom";
import FishDaily from "./pages/FishDaily";
import FishRandom from "./pages/FishRandom";
import FishGallery from "./pages/FishGallery";
import CropsGallery from "./pages/CropsGallery";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/farm" element={<Farm />} />
        <Route path="/crops/daily" element={<CropsDaily />} />
        <Route path="/crops/random" element={<CropsRandom />} />
        <Route path="/fish/daily" element={<FishDaily />} />
        <Route path="/fish/random" element={<FishRandom />} />
        <Route path="/gallery/fish" element={<FishGallery />} />
        <Route path="/gallery/crops" element={<CropsGallery />} />
      </Routes>
    </Router>
  );
}
