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
        className="relative w-[1248px] h-[704px] max-w-[95vw] max-h-[95vh] flex flex-col"
        style={{
          transform: `scale(${scaleFactor})`,
          transformOrigin: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Content */}
        <div className="justify-center align-middle relative z-10 flex flex-col top-[10%] left-[10%] h-[80%] w-[80%] md:w-[60%] md:left-[15%] overflow-y-auto p-4"
        style={{
            backgroundImage: "url('/images/help-bg.png')",
            backgroundSize: "100% 100%",
          }}>
          <button
            onClick={playCloseSound}
            className="clickable absolute top-[2%] left-[3%] text-red-500 text-6xl hover:text-gray-300"
          >
            x
          </button>

          <h2 className="text-[#BC6131] text-center text-2xl md:text-5xl font-semibold mb-2">
            How to Play
          </h2>

          <div className="space-y-4 text-[#BC6131] text-left text-xl sm:text-2xl md:text-3xl leading-none overflow-y-auto">
            <p>- Select a crop from the grid</p>
            <p>- Click "Submit" to guess the crop of the day</p>
            <p>- You get 6 tries to guess correctly</p>
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
            {/* New section explaining up/down arrows */}
            <div className="mt-6">
              <p>
                - Up and down arrows indicate if the correct price/growth time
                is higher or lower:
              </p>
              <div className="ml-10 mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/arrow4U.png"
                    alt="Up Arrow"
                    className="w-6 h-6"
                  />
                  <span>
                    The correct price/growth time is higher than your guess
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="/images/arrow4D.png"
                    alt="Down Arrow"
                    className="w-6 h-6"
                  />
                  <span>
                    The correct price/growth time is lower than your guess
                  </span>
                </div>
              </div>
              {/* Hover tip for season image */}
            <div className="mt-6">
              <p>
                - Hover over the season image to see the season text
              </p>
            </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
