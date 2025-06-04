import ReactDOM from "react-dom";

export default function HelpModal({ isMuted, onClose, scaleFactor }) {
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
        // Keep the dimensions that match the Landing page modal
        className="relative w-[1248px] h-[704px] max-w-[95vw] max-h-[95vh] shadow-lg flex flex-col"
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
            backgroundImage: "url('/images/help-bg.png')",
            backgroundSize: "100% 100%",
          }}
        />

        {/* Content wrapper with padding */}
        <div className="relative z-10 p-6 flex flex-col h-full 4xl:p-24">
          <button
            onClick={playCloseSound}
            className="clickable absolute top-2 left-9 text-red-500 text-6xl hover:text-gray-300"
          >
            x
          </button>

          <h2
            // Applied responsive text sizing: text-4xl sm:text-5xl md:text-7xl 4xl:text-9xl
            className="text-[#BC6131] text-center text-4xl sm:text-5xl md:text-7xl font-semibold mb-8 4xl:text-9xl"
          >
            How to Play
          </h2>

          <div
            // Applied responsive text sizing: text-3xl sm:text-4xl md:text-5xl 4xl:text-8xl
            className="space-y-4 text-[#BC6131] text-left text-3xl sm:text-4xl md:text-5xl list-disc list-inside 4xl:text-8xl overflow-y-auto"
          >
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
      </div>
    </div>,
    document.body
  );
}