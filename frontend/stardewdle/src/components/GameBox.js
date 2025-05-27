import { useState, useEffect } from "react";
import { useSound } from "../context/SoundContext";
import CropGrid from "./CropGrid";
import GuessGrid from "./GuessGrid";
import CropLoader from "../components/CropLoader";
const DAILY_RESET_ENABLED = false; // Set to true to re-enable

function formatName(name) {
  return name
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export default function GameBox() {
  const [guesses, setGuesses] = useState(() => {
    const saved = localStorage.getItem('stardewdle-guesses');
    return saved ? JSON.parse(saved) : [];
  });
  const [gameOver, setGameOver] = useState(() => {
    const saved = localStorage.getItem('stardewdle-gameOver');
    return saved ? JSON.parse(saved) : false;
  });
  const [correctCrop, setCorrectCrop] = useState(() => {
    const saved = localStorage.getItem('stardewdle-correctCrop');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedCrop, setSelectedCrop] = useState(() => {
    const saved = localStorage.getItem('stardewdle-selectedCrop');
    return saved ? JSON.parse(saved) : null;
  });
  const [storedDate, setStoredDate] = useState(() => {
    const saved = localStorage.getItem('stardewdle-date');
    return saved ? saved : new Date().toISOString().split('T')[0]; // Default to today's date
  });
  const [crops, setCrops] = useState([]);

  const [showHelp, setShowHelp] = useState(false);
  const { isMuted, toggleMute } = useSound();
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareText, setShareText] = useState('');
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());

  const isFinalGuess = guesses.length === 5; // next guess is 6th

  function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  function generateShareText(resultGrid, win) {
    const header = win ? "🌱 I solved today's Stardewdle!" : "💀 I couldn't solve today's Stardewdle.";
    const grid = resultGrid
      .map(row => row.map(cell => {
        if (cell === 'correct') return '🟩';
        if (cell === 'partial') return '🟨';
        return '🟥';
      }).join(''))
      .join('\n');
    return `${header}\n\n${grid}\n\nPlay at: https://your-game-url.com`;
  }

  useEffect(() => {
    if (!DAILY_RESET_ENABLED) return;

    localStorage.setItem('stardewdle-guesses', JSON.stringify(guesses));
    localStorage.setItem('stardewdle-correctCrop', JSON.stringify(correctCrop));
    localStorage.setItem('stardewdle-gameOver', JSON.stringify(gameOver));
    localStorage.setItem('stardewdle-selectedCrop', JSON.stringify(selectedCrop));
    localStorage.setItem('stardewdle-date', storedDate);
  }, [guesses, correctCrop, gameOver, selectedCrop, storedDate]);

  useEffect(() => {
    if (!correctCrop || crops.length === 0) {
      const fetchInitialData = async () => {
        try {
          const cropURL = "https://stardewdle-data.s3.amazonaws.com/crops.json";
          const cropResponse = await fetch(cropURL);
          const cropList = await cropResponse.json();
          setCrops(cropList);

          const response = await fetch(
            "https://2vo847ggnb.execute-api.us-east-1.amazonaws.com/word"
          );
          const data = await response.json();
          const word = data.word;

          const cropData = cropList.find(
            (crop) => crop.name.toLowerCase() === word.toLowerCase()
          );

          if (cropData) {
            setCorrectCrop(cropData);
          } else {
            console.warn("Crop not found for word:", word);
          }
        } catch (error) {
          console.error("Failed to fetch crop data or word:", error);
        }
      };

      fetchInitialData();
    }
  }, []);  // <-- Empty dependencies, runs once on mount


  useEffect(() => {
    if (!DAILY_RESET_ENABLED) return;

    const today = new Date().toISOString().split('T')[0];

    const fetchNewCrop = async () => {
      try {
        const cropURL = "https://stardewdle-data.s3.amazonaws.com/crops.json";
        const cropResponse = await fetch(cropURL);
        const cropList = await cropResponse.json();
        setCrops(cropList);

        const response = await fetch(
          "https://2vo847ggnb.execute-api.us-east-1.amazonaws.com/word"
        );
        const data = await response.json();
        const word = data.word;

        const cropData = cropList.find(
          (crop) => crop.name.toLowerCase() === word.toLowerCase()
        );

        if (cropData) {
          setCorrectCrop(cropData);
        } else {
          console.warn("Crop not found for word:", word);
        }
      } catch (error) {
        console.error("Failed to fetch crop data or word:", error);
      }
    };

    if (storedDate !== today || !correctCrop || crops.length === 0) {
      // Reset only if new day
      if (storedDate !== today) {
        setGuesses([]);
        setSelectedCrop(null);
        setGameOver(false);
        setStoredDate(today);
      }

      fetchNewCrop();
    }
  }, [storedDate, correctCrop, crops.length]);



  const handleSubmit = async () => {
    if (!selectedCrop || guesses.length >= 6 || gameOver) return;

    try {

      const response = await fetch(
        "https://2vo847ggnb.execute-api.us-east-1.amazonaws.com/guess",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guess: selectedCrop.name })
        }
      );

      const data = await response.json();
      const result = data.result;

      const newGuess = { crop: selectedCrop, result };
      const updatedGuesses = [...guesses, newGuess];
      const isWin = result && Object.values(result).every((val) => val === "match");

      setGuesses(updatedGuesses);
      if (!gameOver && guesses.length < 6) setSelectedCrop(null);


      if (isWin) {
  setGameOver(true);
  setSelectedCrop(correctCrop);
  if (!isMuted) {
    new Audio("/sounds/reward.mp3").play();
  }

  const text = generateShareText(
    [...guesses, { crop: selectedCrop, result }],
    true
  );
  setShareText(text);
  setShowShareModal(true);
} else {
  if (isFinalGuess) {
    setGameOver(true);
      setSelectedCrop(correctCrop);

    if (!isMuted) {
      new Audio("/sounds/lose.mp3").play();
    }

    const text = generateShareText(
      [...guesses, { crop: selectedCrop, result }],
      false
    );
    setShareText(text);
    setShowShareModal(true);
  } else {
    if (!isMuted) {
      new Audio("/sounds/sell.mp3").play();
    }
  }
}



    } catch (error) {
      console.error("Error submitting guess:", error);
    }
  };

  if (!correctCrop || crops.length === 0) {
    return <CropLoader />;
  }


  return (
    <div
      className="relative flex flex-row shadow-xl bg-no-repeat bg-center mt-3 justify-between w-full pl-3"
      style={{
        backgroundImage: "url('/images/box-bg.png')",
        backgroundSize: "100% 100%",
        width: "1600px",
        height: "800px",
        transform: `scale(.95)`,
      }}
    >
      {/* Crop Grid */}
      <CropGrid
        selectedCrop={selectedCrop}
        onSelect={(!gameOver && guesses.length < 6) ? setSelectedCrop : () => { }}
        crops={crops}
        isMuted={(!gameOver && guesses.length < 6) ? isMuted : true}
      />

      {/* Right Side */}
      <div className="flex flex-col align-center w-full place-items-center">
        {/* Selected Crop Display */}
        <div className="flex flex-row items-center h-full mr-24 mt-[80px] gap-4">
          {/* Crop image in center of frame */}
          <div
            className="relative bg-no-repeat bg-contain"
            style={{
              backgroundImage: "url('/images/selected-frame.png')",
              width: "240px",
              height: "164px"
            }}
          >
            {selectedCrop && (
              <img
                src={selectedCrop.image_url}
                alt={selectedCrop.name}
                className="absolute top-1/2 left-1/2 object-contain -translate-x-1/2 -translate-y-1/2 h-[60%] w-[60%]"
              />
            )}

          </div>
          <div className="flex flex-col items-center">
            {/* Name on banner */}
            <div
              className="flex items-center justify-center bg-center bg-no-repeat bg-contain"
              style={{
                backgroundImage: "url('/images/name-banner.png')",
                width: "416px",
                height: "76px"
              }}
            >
              <p className="text-5xl text-center text-[#BC6131] tracking-wide">
                {selectedCrop ? formatName(selectedCrop.name) : ""}
              </p>
            </div>

            {/* Submit Button */}
            {(gameOver && (guesses[5] ? guesses[5].crop.name === correctCrop.name : true)) ? (
              <p className="mt-4 text-green-700 text-5xl font-bold text-center whitespace-nowrap p-3"
                style={{
                  height: "80px"
                }}
              >You guessed it!
              </p>
            ) : guesses.length >= 6 ? (
              <>
                <p className="mt-4 text-red-600 text-5xl font-bold text-center whitespace-nowrap p-3"
                  style={{
                    height: "80px"
                  }}
                >
                  Better luck next time!
                </p>
              </>
            ) : (
              <div
                onClick={() => {
                  if (!selectedCrop || guesses.length >= 6 || gameOver) return;
                  handleSubmit();
                }}
                className={`relative mt-4 group ${!selectedCrop || guesses.length >= 6 || gameOver
                  ? "opacity-40 pointer-events-none"
                  : "clickable hover:scale-105 transition-transform"
                  }`}
                style={{
                  width: "216px",
                  height: "80px"
                }}
              >
                <img
                  src="/images/submit-button.png"
                  alt="Submit"
                  className="w-full h-full transition-opacity duration-200 group-hover:opacity-0"
                />
                <img
                  src="/images/submit-button-hover.png"
                  alt="Submit Hover"
                  className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
              </div>
            )
            }

          </div>

        </div>

        {/* Guess Grid */}
        <div className="mr-[78px] mb-[84px] pl-9 bg-center bg-no-repeat bg-cover min-h-[440px]"
          style={{
            backgroundImage: "url('/images/guesses.png')",
            width: "772px",
            height: "456px"
          }}
        >
          <GuessGrid guesses={guesses} answer={correctCrop} />
        </div>
      </div>
      {/* Mute/Unmute Button */}
      <div
        onClick={() => {
          if (isMuted) {
            new Audio("/sounds/pluck.mp3").play();
          }
          toggleMute(); // ← actually change mute state
        }}
        className="absolute bottom-16 -right-11 w-[30px] h-[30px] clickable z-10"
      >
        <img
          src={isMuted ? "/images/muted.png" : "/images/unmuted.png"}
          alt="Toggle Sound"
          className="w-full h-full"
        />
      </div>
      {/* Mute/Unmute Button */}


      {/* Help Button */}
      <div
        onClick={() => {
          if (!isMuted) {
            new Audio("/sounds/help.mp3").play();
          }
          setShowHelp(true)
        }}
        className="absolute bottom-1 -right-14 w-[50px] h-[50px] group clickable z-10"
      >
        {/* Default button image */}
        <img
          src="/images/question-mark.png"
          alt="Help"
          className="w-full h-full transition-opacity duration-200 group-hover:opacity-0"
        />
        {/* Hover button image */}
        <img
          src="/images/question-mark-hover.png"
          alt="Help Hover"
          className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      </div>


      {/* Help Modal */}
      {showHelp && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
          onClick={() => {
            if (!isMuted) {
              new Audio("/sounds/help.mp3").play();
            }
            setShowHelp(false)
          }}
        >
          <div
            className="w-[708px] h-[1256] max-w-[90%] rounded-2xl p-10 shadow-2xl relative bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/help-bg.png')",
              backgroundSize: "100% 100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                if (!isMuted) {
                  new Audio("/sounds/help.mp3").play();
                }
                setShowHelp(false)
              }}
              className="absolute top-1 left-5 text-[#BC6131] hover:text-white text-6xl"
            >
              x
            </button>

            {/* Help Content */}
            {/* Help Content */}
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
        </div>
      )}

      {showShareModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    onClick={() => setShowShareModal(false)}
  >
    <div
      className="relative w-[500px] p-6 bg-white rounded-lg shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setShowShareModal(false)}
        className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-gray-800"
      >
        &times;
      </button>
      <h2 className="text-3xl font-bold text-center text-[#BC6131] mb-4">Share Your Result</h2>

      <pre className="bg-gray-100 p-4 rounded text-lg whitespace-pre-wrap">{shareText}</pre>

      <p className="mt-4 text-center text-gray-600 text-xl">
        🕒 Next crop in: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </p>

      <button
        onClick={() => {
          navigator.clipboard.writeText(shareText);
        }}
        className="mt-4 w-full bg-[#BC6131] text-white py-2 px-4 rounded hover:bg-[#9c4f26] transition"
      >
        Copy to Clipboard
      </button>
    </div>
  </div>
)}

    </div>
  );
}
