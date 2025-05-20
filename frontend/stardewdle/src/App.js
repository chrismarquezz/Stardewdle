import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import Farm from "./pages/Collections";
import CropsDaily from "./pages/CropsDaily";
import CropsRandom from "./pages/CropsRandom";
import FishDaily from "./pages/FishDaily";
import FishRandom from "./pages/FishRandom";
import FishGallery from "./pages/FishGallery";
import CropsGallery from "./pages/CropsGallery";

function Landing() {
  const navigate = useNavigate();

  const [showPopupOne, setShowPopupOne] = useState(false);
  const [showPopupTwo, setShowPopupTwo] = useState(false);
  const [showPopupThree, setShowPopupThree] = useState(false);
  const [showSubPopup, setShowSubPopup] = useState(null);

  return (
    <div className="flex flex-col items-center pt-40 min-h-screen bg-gray-100">
      <h1 className="text-7xl font-extrabold text-gray-800 mb-40">
        Welcome to Stardewdle
      </h1>

      <div className="flex flex-col space-y-10">
        <button
          onClick={() => setShowPopupOne(true)}
          className="w-80 py-6 text-3xl font-bold bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition"
        >
          Button One
        </button>
        <button
          onClick={() => setShowPopupTwo(true)}
          className="w-80 py-6 text-3xl font-bold bg-green-600 text-white rounded-3xl hover:bg-green-700 transition"
        >
          Button Two
        </button>
        <button
          onClick={() => setShowPopupThree(true)}
          className="w-80 py-6 text-3xl font-bold bg-purple-600 text-white rounded-3xl hover:bg-purple-700 transition"
        >
          Button Three
        </button>
      </div>

      {/* Popup One - Crops/Fish */}
      {showPopupOne && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
          onClick={() => {
            setShowPopupOne(false);
            setShowSubPopup(null);
          }}
        >
          <div
            className="bg-white shadow-2xl rounded-3xl p-12 flex space-x-16 border border-gray-300 scale-125"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSubPopup("crops")}
              className="bg-yellow-500 px-12 py-6 text-3xl rounded-2xl font-bold text-white hover:bg-yellow-600 transition"
            >
              Crops
            </button>
            <button
              onClick={() => setShowSubPopup("fish")}
              className="bg-blue-300 text-blue-900 px-12 py-6 text-3xl rounded-2xl font-bold hover:bg-blue-400 transition"
            >
              Fish
            </button>
          </div>
        </div>
      )}

      {/* Popup Two - Blank */}
      {showPopupTwo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30"
          onClick={() => setShowPopupTwo(false)}
        >
          <div
            className="bg-white w-[700px] h-[500px] rounded-3xl shadow-2xl border border-gray-300"
            onClick={(e) => e.stopPropagation()}
          ></div>
        </div>
      )}

      {/* Popup Three - Route to Gallery */}
      {showPopupThree && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
          onClick={() => setShowPopupThree(false)}
        >
          <div
            className="bg-white shadow-2xl rounded-3xl p-12 flex space-x-16 border border-gray-300 scale-125"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowPopupThree(false);
                navigate("/gallery/crops");
              }}
              className="bg-yellow-500 px-12 py-6 text-3xl rounded-2xl font-bold text-white hover:bg-yellow-600 transition"
            >
              Crops
            </button>
            <button
              onClick={() => {
                setShowPopupThree(false);
                navigate("/gallery/fish");
              }}
              className="bg-blue-300 text-blue-900 px-12 py-6 text-3xl rounded-2xl font-bold hover:bg-blue-400 transition"
            >
              Fish
            </button>
          </div>
        </div>
      )}

      {/* Subpopup for Button 1 */}
      {showSubPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30"
          onClick={() => setShowSubPopup(null)}
        >
          <div
            className="bg-white shadow-2xl rounded-3xl px-16 py-14 flex flex-col items-center border border-gray-300 scale-125"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-4xl font-bold mb-12 text-gray-800 capitalize">
              {showSubPopup} Options
            </h2>
            <div className="flex space-x-20">
              <button
                onClick={() => {
                  setShowPopupOne(false);
                  setShowSubPopup(null);
                  navigate(`/${showSubPopup}/daily`);
                }}
                className="bg-orange-500 px-16 py-8 text-4xl rounded-2xl font-bold text-white hover:bg-orange-600 transition"
              >
                Daily
              </button>
              <button
                onClick={() => {
                  setShowPopupOne(false);
                  setShowSubPopup(null);
                  navigate(`/${showSubPopup}/random`);
                }}
                className="bg-indigo-500 px-16 py-8 text-4xl rounded-2xl font-bold text-white hover:bg-indigo-600 transition"
              >
                Random
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
