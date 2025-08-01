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
        className="relative max-w-[95vw] max-h-[95vh] flex flex-col"
        style={{
          transform: `scale(${scaleFactor})`,
          transformOrigin: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Content */}
        <div className="justify-center align-middle relative z-10 flex flex-col overflow-y-auto p-4 md:pl-8 md:pr-8"
          style={{
            backgroundImage: "url('/images/help-bg.webp')",
            backgroundSize: "100% 100%",
          }}>
          <button
            onClick={playCloseSound}
            className="clickable absolute top-0 text-red-500 text-4xl md:text-6xl hover:text-gray-300"
          >
            x
          </button>

          <h2 className="text-[#BC6131] text-center text-2xl md:text-5xl font-semibold mb-2">
            How to Play
          </h2>

          <div className="space-y-2 md:space-y-4 text-[#BC6131] text-left text-md sm:text-2xl md:text-3xl leading-none overflow-y-auto">
            <p>- Select a crop from the grid</p>
            <p>- Click "Submit" to guess the crop of the day</p>
            <p>- You get 6 tries to guess correctly</p>
            <div>
              <p>- The result grid shows feedback:</p>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-10 text-nowrap">
                <div className="ml-4 md:ml-10 mt-2 md:mt-4 space-y-2 md:space-y-4">
                  <div className="flex items-center gap-1 md:gap-3">
                    <div className="w-3 h-3 md:w-6 md:h-6 bg-green-500 border md:border-2 border-green-700 rounded-sm" />
                    <span>Exact match</span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-3">
                    <div className="w-3 h-3 md:w-6 md:h-6 bg-yellow-400 border md:border-2 border-yellow-600 rounded-sm" />
                    <span>Partial match</span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-3">
                    <div className="w-3 h-3 md:w-6 md:h-6 bg-red-500 border md:border-2 border-red-700 rounded-sm" />
                    <span>Incorrect</span>
                  </div>
                </div>
                <div className="space-y-2 md:space-y-4">
                  <div className="flex items-center gap-1 md:gap-3">
                    <img
                      src="/images/arrow4U.webp"
                      alt="Up Arrow"
                      className="w-3 h-3 md:w-6 md:h-6"
                    />
                    <span>
                      The correct value is higher
                    </span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-3">
                    <img
                      src="/images/arrow4D.webp"
                      alt="Down Arrow"
                      className="w-3 h-3 md:w-6 md:h-6"
                    />
                    <span>
                      The correct value is lower
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 md:mt-4">
              <p>
                - Hover over the season image to see the season name
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
