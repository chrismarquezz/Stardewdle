import ReactDOM from "react-dom";
import React, { useState } from "react";

export default function ShareModal({
  shareText,
  correctGuesses,
  timeLeft,
  onClose,
  isMuted,
  scaleFactor,
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
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={playCloseSound}
      />

      {/* Modal Content */}
      <div
        // Keep the dimensions that match the Landing page modal
        className="relative w-[1248px] h-[704px] max-w-[95vw] max-h-[95vh] shadow-lg flex flex-col justify-between"
        style={{
          transform: `scale(${scaleFactor})`, // Use the passed scaleFactor
          transformOrigin: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background image for the modal, now as an inner div */}
        <div
          className="absolute inset-0 bg-no-repeat bg-cover bg-center -z-10"
          style={{
            backgroundImage: "url('/images/help-bg.png')", // Assuming help-bg.png is correct for share modal
            backgroundSize: "100% 100%",
          }}
        />

        {/* Content wrapper with padding */}
        <div className="relative z-10 p-6 flex flex-col h-full justify-between 4xl:p-12">
          {/* Close Button */}
          <button
            onClick={playCloseSound}
            className="clickable absolute top-2 left-9 text-red-500 text-6xl hover:text-gray-300"
          >
            x
          </button>
          {/* UTC Timer */}
          <h2
            // Applied responsive text sizing for heading
            className="text-[#BC6131] text-center text-4xl sm:text-5xl md:text-7xl font-bold mb-2 3xl:text-9xl"
          >
            Next crop in: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </h2>

          {/* Wins Today */}
          <p
            // Applied responsive text sizing for paragraph
            className="mt-2 text-center text-[#BC6131] text-3xl sm:text-4xl md:text-5xl mb-4 3xl:text-8xl"
          >
            {correctGuesses ?? 0} people have solved today's puzzle!
          </p>

          {/* Share Text Block */}
          <p className="bg-[#FFD789] w-[80%] mx-auto bg-opacity-60 border-4 border-[#BC6131] p-4 text-[#BC6131] text-2xl sm:text-3xl md:text-4xl 3xl:text-7xl whitespace-pre text-center font-Stardew leading-none flex-grow overflow-y-auto ">
            {shareText}
          </p>

          {/* Copy Section */}
          <div className="mt-2 w-[50%] mx-auto flex flex-col items-center relative">
            <button
              onClick={handleCopy}
              className="mt-6 clickable w-full bg-[#BC6131] text-white text-4xl py-2 hover:bg-[#9c4f26] transition"
            >
              {copied ? "Copied to Clipboard!" : "Share"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}