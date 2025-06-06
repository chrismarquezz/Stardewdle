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
    <div className="fixed inset-0 z-20 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 z-0"
        onClick={playCloseSound}
      />

      {/* Modal Content */}
      <div
        // Keep the dimensions that match the Landing page modal
        className="relative max-w-[95vw] max-h-[95vh] flex flex-col justify-between"
        style={{
          transform: `scale(${scaleFactor})`, // Use the passed scaleFactor
          transformOrigin: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Content wrapper with padding */}
        <div className="justify-center align-middle relative z-10 flex flex-col overflow-y-auto p-4 "
        style={{
            backgroundImage: "url('/images/help-bg.png')",
            backgroundSize: "100% 100%",
          }}>
          {/* Close Button */}
          <button
            onClick={playCloseSound}
            className="clickable absolute left-[10px] top-[4px] md:top-0 text-red-500 text-4xl md:text-6xl hover:text-gray-300"
          >
            x
          </button>
          {/* UTC Timer */}
          <p
            className="text-[#BC6131] text-center text-lg md:text-5xl font-bold md:mb-1 md:min-w-[520px]"
          >
            Next crop in: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </p>

          {/* Wins Today */}
          <p
            // Applied responsive text sizing for paragraph
            className="text-center text-[#BC6131] text-md sm:text-3xl md:text-3xl mb-1"
          >
            {correctGuesses ?? 0} people have solved today's puzzle!
          </p>

          {/* Share Text Block */}
          <p className="flex min-h-40 min-w-30 bg-[#FFD789] mx-auto bg-opacity-60 border-2 border-[#BC6131] p-4 text-[#BC6131] text-sm md:text-xl whitespace-pre text-center flex-wrap overflow-y-auto ">
            {shareText}
          </p>

          {/* Copy Section */}
          <div className="md:mt-1 w-[50%] mx-auto flex flex-col items-center relative">
            <button
              onClick={handleCopy}
              className="mt-2 clickable w-full bg-[#BC6131] text-white sm:text-lg md:text-4xl py-1 md:py-2 hover:bg-[#9c4f26] transition"
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