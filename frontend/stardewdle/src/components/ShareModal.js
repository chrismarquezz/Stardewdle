import ReactDOM from "react-dom";
import React, { useState } from "react";

export default function ShareModal({
  shareText,
  correctGuesses,
  timeLeft,
  onClose,
  isMuted,
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
        className="w-[800px] h-[1256] max-w-[90%] rounded-2xl p-10 shadow-2xl relative bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/help-bg.png')",
          backgroundSize: "100% 100%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={playCloseSound}
          className="absolute top-1 left-5 text-[#BC6131] hover:text-white text-6xl"
        >
          x
        </button>
        {/* UTC Timer */}
        <h2 className="text-6xl font-bold text-center text-[#BC6131] mb-2">
          {" "}
          Next crop in: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}
          s
        </h2>

        {/* Wins Today */}
        <p className="mt-2 text-center text-[#BC6131] text-2xl mb-4">
          {correctGuesses ?? 0} people have solved today's puzzle!
        </p>

        {/* Share Text Block */}
        <pre className="bg-gray-100 p-4 rounded text-[#BC6131] text-lg whitespace-pre text-center leading-none">
          {shareText}
        </pre>

        {/* Copy Section */}
        <div className="mt-6 w-full flex flex-col items-center relative">
          <button
            onClick={handleCopy}
            className="w-full bg-[#BC6131] text-white py-2 px-4 text-3xl rounded hover:bg-[#9c4f26] transition"
          >
            Share your results
          </button>

          {copied && (
            <div className="mt-2 text-2xl text-[#BC6131] font-semibold z-10">
              Copied to clipboard!
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
