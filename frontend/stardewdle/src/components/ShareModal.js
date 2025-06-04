import ReactDOM from "react-dom";
import React, { useState } from "react";

export default function ShareModal({
  shareText,
  correctGuesses,
  timeLeft,
  onClose,
  isMuted,
  scaleFactor, // Accept scaleFactor
}) {
  const [copied, setCopied] = useState(false);

  const playCloseSound = () => {
    if (!isMuted) {
      new Audio("/sounds/help.mp3").play();
    }
    onClose();
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // hide after 2 seconds
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="relative inset-0 bg-black bg-opacity-50"
        onClick={playCloseSound}
      />

      {/* Modal Content */}
      <div
        className="absolute w-full h-full shadow-lg p-10" // Removed direct background styles
        style={{
          transform: `scale(${.6})`, // Apply scaling here
          transformOrigin: "center", // Scale from center
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background image for the modal, now as an inner div */}
        <div
          className="absolute inset-0 bg-no-repeat bg-cover bg-center -z-10" // -z-10 to place it behind content
          style={{
            backgroundImage: "url('/images/help-bg.png')",
            backgroundSize: "100% 100%", // Stretch background image to fill
          }}
        />

        {/* Close Button */}
        <button
          onClick={playCloseSound}
          className="clickable absolute top-1 left-5 text-[#BC6131] hover:text-white text-6xl"
        >
          x
        </button>
        {/* UTC Timer */}
        <h2 className="mt-4 text-6xl font-bold text-center text-[#BC6131] mb-2">
          {" "}
          Next crop in: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}
          s
        </h2>

        {/* Wins Today */}
        <p className="mt-2 text-center text-[#BC6131] text-2xl mb-4">
          {correctGuesses ?? 0} people have solved today's puzzle!
        </p>

        {/* Share Text Block */}
        <p className="bg-[#FFD789] w-[80%] mx-auto bg-opacity-60 border-4 border-[#BC6131] p-4 text-[#BC6131] text-2xl whitespace-pre text-center font-Stardew leading-none">
          {shareText}
        </p>

        {/* Copy Section */}
        <div className="mt-2 w-[50%] mx-auto flex flex-col items-center relative">
          <button
            onClick={handleCopy} // Use the handleCopy function
            className="mt-6 clickable w-full bg-[#BC6131] text-white text-4xl py-2 hover:bg-[#9c4f26] transition"
          >
            {copied ? "Copied to Clipboard!" : "Share"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}