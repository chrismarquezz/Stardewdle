import { useNavigate } from "react-router-dom";
import { useSound } from "../context/SoundContext";
import { useState } from "react";

export default function Landing() {
  const { isMuted } = useSound();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div
    
  className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center"
  style={{ backgroundImage: "url('/images/background.jpg')" }}
>
  {/* Title near top */}
  <img
    src="/images/stardewdleTitle.png"
    alt="Stardewdle Title"
    className="w-[900px] mt-20 mb-20"
  />
      <audio src="/sounds/landing-music.mp3" autoPlay loop hidden />

  {/* Button group centered vertically in remaining space */}
<div className="flex flex-col items-center justify-center flex-grow gap-10">
  {/* Play Button */}
  <div
    onClick={() => {
      if (!isMuted) {
        new Audio("/sounds/menu-select.mp3").play();
      }
      navigate("/game");
    }}
    className="relative w-[400px] cursor-pointer group transform transition-transform duration-200 hover:scale-105"
  >
    <img
      src="/images/play-button.png"
      alt="Play"
      className="w-full transition-opacity duration-200 group-hover:opacity-0"
    />
    <img
      src="/images/play-button-hover.png"
      alt="Play Hover"
      className="absolute top-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    />
  </div>

  {/* Collections Button */}
  <div
    onClick={() => {
      if (!isMuted) {
        new Audio("/sounds/menu-select.mp3").play();
      }
      navigate("/collections");
    }}
    className="relative w-[400px] cursor-pointer group transform transition-transform duration-200 hover:scale-105"
  >
    <img
      src="/images/collections-button.png"
      alt="Collections"
      className="w-full transition-opacity duration-200 group-hover:opacity-0"
    />
    <img
      src="/images/collections-button-hover.png"
      alt="Collections Hover"
      className="absolute top-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    />
  </div>
  <div className="flex gap-2 mt-2">
  <button
  onClick={() => {
      if (!isMuted) {
        new Audio("/sounds/mouseClick.mp3").play();
      }
      window.open('https://github.com/chrismarquezz/Stardewdle', '_blank')}}
  className="relative w-14 h-14 transition-transform hover:scale-105"
>
  <img
    src="/images/github.png"
    alt="GitHub"
    className="absolute inset-0 w-full h-full object-contain hover:opacity-0 transition-opacity duration-200"
  />
  <img
    src="/images/github-hover.png"
    alt="GitHub Hover"
    className="w-full h-full object-contain"
  />
</button>


  <button
  onClick={() => {
      if (!isMuted) {
        new Audio("/sounds/mouseClick.mp3").play();
      }
      setShowModal(true);}}
  className="relative w-14 h-14 transition-transform hover:scale-105"
>
  <img
    src="/images/credits.png"
    alt="Info"
    className="absolute inset-0 w-full h-full object-contain hover:opacity-0 transition-opacity duration-200"
  />
  <img
    src="/images/credits-hover.png"
    alt="Info Hover"
    className="w-full h-full object-contain"
  />
</button>

</div>

</div>

  {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
      >
        &times;
      </button>
      <h2 className="text-lg font-semibold mb-4">Modal Title</h2>
      <p>This is your modal content.</p>
    </div>
  </div>
)}

</div>

  );
}
