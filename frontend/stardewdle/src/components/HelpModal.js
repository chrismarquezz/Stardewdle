import ReactDOM from "react-dom";

export default function HelpModal({ isMuted, onClose }) {
  const playCloseSound = () => {
    if (!isMuted) {
      new Audio("/sounds/modal.mp3").play();
    }
    onClose();
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
      onClick={playCloseSound}
    >
      <div
        className="relative max-w-[95vw] max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        <div
          className="relative z-10 flex flex-col overflow-y-auto p-6 md:pl-10 md:pr-10
          w-[85vw] max-w-[1100px] h-auto md:h-[80vh]"
          style={{
            backgroundImage: "url('/images/help-bg.webp')",
            backgroundSize: "100% 100%",
          }}
        >
          {/* Close button */}
          <button
            onClick={playCloseSound}
            className="clickable absolute top-2 left-6 text-red-500 text-4xl md:text-7xl hover:text-gray-300"
          >
            x
          </button>

          {/* Title */}
          <h2 className="text-[#BC6131] text-center text-3xl sm:text-5xl md:text-7xl font-semibold mb-6 mt-2">
            How to Play
          </h2>

          {/* Content */}
          <div className="flex-1 space-y-4 md:space-y-6 text-[#BC6131] text-left text-lg sm:text-3xl md:text-4xl leading-snug overflow-y-auto">
            <p>- Select a crop from the grid</p>
            <p>- Click "Submit" to guess the crop of the day</p>
            <p>- You get 6 tries to guess correctly</p>

            <div>
              <p>- The result grid shows feedback:</p>
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10 text-nowrap">
                <div className="ml-6 md:ml-10 mt-2 md:mt-4 space-y-3 md:space-y-5">
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="w-4 h-4 md:w-8 md:h-8 bg-green-500 border md:border-2 border-green-700 rounded-sm" />
                    <span>Exact match</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="w-4 h-4 md:w-8 md:h-8 bg-yellow-400 border md:border-2 border-yellow-600 rounded-sm" />
                    <span>Partial match</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="w-4 h-4 md:w-8 md:h-8 bg-red-500 border md:border-2 border-red-700 rounded-sm" />
                    <span>Incorrect</span>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-5">
                  <div className="flex items-center gap-2 md:gap-4">
                    <img
                      src="/images/arrow4U.webp"
                      alt="Up Arrow"
                      className="w-4 h-4 md:w-8 md:h-8"
                    />
                    <span>The correct value is higher</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4">
                    <img
                      src="/images/arrow4D.webp"
                      alt="Down Arrow"
                      className="w-4 h-4 md:w-8 md:h-8"
                    />
                    <span>The correct value is lower</span>
                  </div>
                </div>
              </div>
            </div>
            <p>- Hover over the season image to see the season name</p>
            <p>
              - If you ever feel stuck, turn on the hint feature to eliminate
              possible crops based on feedback from each guess
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
