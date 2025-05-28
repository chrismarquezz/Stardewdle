import ReactDOM from 'react-dom';

export default function HelpModal({ isMuted, onClose }) {
  const playCloseSound = () => {
    if (!isMuted) {
      new Audio("/sounds/help.mp3").play();
    }
    onClose();
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
      onClick={playCloseSound}
    >
      <div
        className="w-[708px] h-[1256] max-w-[90%] rounded-2xl p-10 shadow-2xl relative bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/help-bg.png')",
          backgroundSize: "100% 100%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={playCloseSound}
          className="absolute top-1 left-5 text-[#BC6131] hover:text-white text-6xl"
        >
          x
        </button>

        <h2 className="text-6xl font-bold text-[#BC6131] mb-6 text-center">How to Play</h2>

        <div className="space-y-4 text-3xl text-[#BC6131] px-2">
          <p>- Select a crop from the grid.</p>
          <p>- Click "Submit" to guess the crop of the day.</p>
          <p>- You get 6 tries to guess correctly.</p>
          <div>
            <p>- The result grid shows feedback:</p>
            <div className="ml-10 mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 border-2 border-green-700 rounded-sm shadow-sm" />
                <span>Exact match</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-yellow-400 border-2 border-yellow-600 rounded-sm shadow-sm" />
                <span>Partial match</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500 border-2 border-red-700 rounded-sm shadow-sm" />
                <span>Incorrect</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
