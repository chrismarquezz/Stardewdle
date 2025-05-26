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
        className="mt-20"
      />
      <audio src="/sounds/landing-music.mp3" autoPlay loop hidden />

      {/* Button group centered vertically in remaining space */}
      <div className="flex flex-col items-center gap-4 mt-[220px]">
        {/* Play Button */}
        <div
          onClick={() => {
            if (!isMuted) {
              new Audio("/sounds/menu-select.mp3").play();
            }
            navigate("/game");
          }}
          className="buttonMain w-[370px] h-[75px] clickable "
        >
          <img
            src="/images/play-button.png"
            alt="Play"
            className="buttonBase"
          />
          <img
            src="/images/play-button-hover.png"
            alt="Play Hover"
            className="buttonHover"
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
          className="buttonMain w-[370px] h-[75px] clickable"
        >
          <img
            src="/images/collections-button.png"
            alt="Collections"
            className="buttonBase"
          />
          <img
            src="/images/collections-button-hover.png"
            alt="Collections Hover"
            className="buttonHover"
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              if (!isMuted) {
                new Audio("/sounds/mouseClick.mp3").play();
              }
              window.open('https://github.com/chrismarquezz/Stardewdle', '_blank')
            }}
            className="buttonMain w-[75px] h-[75px] clickable"
          >
            <img
              src="/images/github.png"
              alt="GitHub"
              className="buttonBase"
            />
            <img
              src="/images/github-hover.png"
              alt="GitHub Hover"
              className="buttonHover"
            />
          </button>

          <button
            onClick={() => {
              if (!isMuted) {
                new Audio("/sounds/mouseClick.mp3").play();
              }
              setShowModal(true);
            }}
            className="buttonMain w-[75px] h-[75px] clickable"
          >
            <img
              src="/images/credits.png"
              alt="Info"
              className="buttonBase"
            />
            <img
              src="/images/credits-hover.png"
              alt="Info Hover"
              className="buttonHover"
            />
          </button>

        </div>

      </div>

  {showModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    onClick={() => {
      if (!isMuted) {
        new Audio("/sounds/mouseClick.mp3").play();
      }
    setShowModal(false)}}
  >
    <div
      className="relative w-[1248px] h-[704px] p-6 shadow-lg bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/paper-note.png')",
      }}
      onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicked inside
    >
      <button
        onClick={() => {
      if (!isMuted) {
        new Audio("/sounds/mouseClick.mp3").play();
      }
    setShowModal(false)}}
        className="absolute top-2 left-9 text-red-500 text-6xl hover:text-gray-300"
      >
        x
      </button>
      <div className="p-4">
        <h2 className="text-gray-600 text-center text-7xl font-semibold mb-8">Credits</h2>
        <ul className="text-gray-600 text-5xl list-disc list-inside space-y-24">
  <p>- Built by Chris and Omar.</p>
  <p>- Artwork and sounds by ConcernedApe.</p>
  <p>- Inspired by Wordle and Stardew Valley.</p>
</ul>

      </div>
    </div>
  </div>
)}

</div>

  );
}
