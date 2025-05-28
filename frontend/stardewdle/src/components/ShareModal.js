export default function ShareModal({ shareText, correctGuesses, timeLeft, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative w-[500px] p-6 bg-white rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-[#BC6131] mb-4">
          Share Your Result
        </h2>

        {/* Share Text Block */}
        <pre className="bg-gray-100 p-4 rounded text-lg whitespace-pre-wrap text-center">
          {shareText}
        </pre>

        {/* UTC Timer */}
        <p className="mt-4 text-center text-gray-600 text-xl">
          Next crop in: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </p>

        {/* Wins Today */}
        <p className="mt-2 text-center text-gray-600 text-lg">
          ✅ {correctGuesses ?? 0} people have solved it today
        </p>

        {/* Copy Button */}
        <button
          onClick={() => navigator.clipboard.writeText(shareText)}
          className="mt-6 w-full bg-[#BC6131] text-white py-2 px-4 rounded hover:bg-[#9c4f26] transition"
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
}
