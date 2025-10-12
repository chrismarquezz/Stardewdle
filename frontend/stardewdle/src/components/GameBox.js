import { useState, useEffect, useRef } from "react";
import { useSound } from "../context/SoundContext";
import CropGrid from "./CropGrid";
import GuessGrid from "./GuessGrid";
import CropLoader from "../components/CropLoader";
import ShareModal from "./ShareModal";
import HelpModal from "./HelpModal";
import UpdatesModal from "./UpdatesModal";

const DAILY_RESET_ENABLED = true;

function formatName(name) {
  return name
    .replace(/_/g, " ")
    .replace(
      /\w\S*/g,
      (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    );
}

function todaysDate() {
  const today = new Date(new Date().toUTCString());
  return `${today.getUTCMonth() + 1
    }/${today.getUTCDate()}/${today.getUTCFullYear()}`;
}

function getTimeUntilMidnightUTC() {
  const now = new Date();
  const utcNow = new Date(now.toUTCString());
  const utcMidnight = new Date(
    Date.UTC(
      utcNow.getUTCFullYear(),
      utcNow.getUTCMonth(),
      utcNow.getUTCDate() + 1,
      0,
      0,
      0
    )
  );
  const diff = utcMidnight - utcNow;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

export default function GameBox({ isMobilePortrait }) {
  const [correctCrop, setCorrectCrop] = useState(() => {
    const saved = localStorage.getItem("stardewdle-correctCrop");
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedCrop, setSelectedCrop] = useState(() => {
    const saved = localStorage.getItem("stardewdle-selectedCrop");
    return saved ? JSON.parse(saved) : null;
  });
  const [guesses, setGuesses] = useState(() => {
    const saved = localStorage.getItem("stardewdle-guesses");
    return saved ? JSON.parse(saved) : [];
  });
  const [gameOver, setGameOver] = useState(() => {
    const saved = localStorage.getItem("stardewdle-gameOver");
    return saved ? JSON.parse(saved) : false;
  });

  const [storedDate, setStoredDate] = useState(() => {
    const saved = localStorage.getItem("stardewdle-date");
    return saved ? saved : new Date().toISOString().split("T")[0];
  });
  const [crops, setCrops] = useState(() => {
    const saved = localStorage.getItem("stardewdle-crops");
    return saved ? JSON.parse(saved) : [];
  });

  const [showHelp, setShowHelp] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareText, setShareText] = useState("");
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnightUTC());
  const [correctGuesses, setCorrectGuesses] = useState(null);
  const [totalGuesses, setTotalGuesses] = useState(null);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const { isMuted, toggleMute } = useSound();

  const isFinalGuess = guesses.length === 5;

  function generateShareText(resultGrid, win) {
    const header = win
      ? "I solved today's Stardewdle!"
      : "I couldn't solve today's Stardewdle.";

    const grid = resultGrid
      .map((row) =>
        Object.values(row.result)
          .map((val) => {
            if (val === "match") return "🟩";
            if (val === "partial") return "🟨";
            return "🟥";
          })
          .join("")
      )
      .join("\n");

    return `${todaysDate()}\n${header}\n${grid}\nPlay at: https://stardewdle.com/`;
  }

  useEffect(() => {
    if (gameOver && !shareText && guesses.length > 0) {
      const isWin = guesses.some(
        (g) =>
          g.crop.name.toLowerCase() === correctCrop?.name.toLowerCase() &&
          Object.values(g.result).every((val) => val === "match")
      );
      const text = generateShareText(guesses, isWin);
      setShareText(text);
    }
  }, [gameOver, shareText, guesses, correctCrop]);

  useEffect(() => {
    const hasSeenHelpModal = localStorage.getItem(
      "stardewdle-hasSeenHelpModal"
    );
    if (!hasSeenHelpModal) {
      setShowHelp(true);
      localStorage.setItem("stardewdle-hasSeenHelpModal", "true");
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilMidnightUTC());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (guesses.length >= 6) {
      setSelectedCrop(correctCrop);
    }
  }, [guesses, correctCrop]);

  useEffect(() => {
    if (!DAILY_RESET_ENABLED) return;

    localStorage.setItem("stardewdle-guesses", JSON.stringify(guesses));
    localStorage.setItem("stardewdle-correctCrop", JSON.stringify(correctCrop));
    localStorage.setItem("stardewdle-gameOver", JSON.stringify(gameOver));
    localStorage.setItem("stardewdle-selectedCrop", JSON.stringify(selectedCrop));
    localStorage.setItem("stardewdle-date", storedDate);
    localStorage.setItem("stardewdle-crops", JSON.stringify(crops));
  }, [guesses, correctCrop, gameOver, selectedCrop, storedDate, crops]);

  useEffect(() => {
    const updateGuessStats = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_API_URL + "/word");
        const data = await res.json();
        setCorrectGuesses(data.correct_guesses);
        setTotalGuesses(data.total_guesses);
      } catch (err) {
        console.error("Failed to fetch win stats:", err);
      }
    };

    updateGuessStats();
  }, []);

  useEffect(() => {
    if (!DAILY_RESET_ENABLED) return;

    const today = new Date().toISOString().split("T")[0];

    const fetchNewCrop = async () => {
      try {
        const cropResponse = await fetch(process.env.REACT_APP_API_URL + "/crops");
        if (!cropResponse.ok) {
          throw new Error(`HTTP error! status: ${cropResponse.status}`);
        }
        const cropList = await cropResponse.json();
        setCrops(cropList);

        if (cropList.length === 0) return;

        const response = await fetch(process.env.REACT_APP_API_URL + "/word");
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
      if (storedDate !== today) {
        setGuesses([]);
        setSelectedCrop(null);
        setGameOver(false);
        setStoredDate(today);
      }
      fetchNewCrop();
    }
  }, [storedDate, correctCrop]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("Tab is visible again, reloading...");
        window.location.reload();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleSubmit = async () => {
    if (!selectedCrop || guesses.length >= 6 || gameOver) return;

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guess: selectedCrop.name,
          guessNum: guesses.length + 1,

        }),
      }
      );

      const data = await response.json();
      const result = data.result;

      const newGuess = { crop: selectedCrop, result };
      const updatedGuesses = [...guesses, newGuess];
      const isWin =
        result && Object.values(result).every((val) => val === "match");

      setGuesses(updatedGuesses);
      if (!gameOver && guesses.length < 6) setSelectedCrop(null);

      if (isWin) {
        setGameOver(true);
        if (!isMuted) new Audio("/sounds/reward.mp3").play();
        setSelectedCrop(correctCrop);

        try {
          const res = await fetch(
            process.env.REACT_APP_API_URL + "/word"
          );
          const data = await res.json();
          setCorrectGuesses(data.correct_guesses);
          setTotalGuesses(data.total_guesses);
        } catch (err) {
          console.error("Failed to fetch win stats:", err);
        }

        const text = generateShareText([...guesses, newGuess], true);
        setShareText(text);
        setShowShareModal(true);
      } else if (isFinalGuess) {
        setGameOver(true);
        if (!isMuted) new Audio("/sounds/lose.mp3").play();

        const text = generateShareText([...guesses, newGuess], false);
        setShareText(text);
        setShowShareModal(true);
      } else {
        if (!isMuted) new Audio("/sounds/sell.mp3").play();
      }
    } catch (error) {
      console.error("Error submitting guess:", error);
    }
  };

  if (!correctCrop || crops.length === 0) {
    return (
      <CropLoader
        className={isMobilePortrait ? "content-counter-rotate-mobile" : ""}
      />
    );
  }

  return (
    <div
      className={`relative shadow-xl bg-no-repeat bg-center ${isMobilePortrait
          ? "gamebox-mobile-layout"
          : "flex flex-row justify-between w-full pl-3 mt-3"
        }`}
      style={{
        backgroundImage: isMobilePortrait
          ? "url('/images/box-bg-sm.webp')"
          : "url('/images/box-bg.webp')",
        backgroundSize: "100% 100%",
        width: isMobilePortrait ? "1500px" : "1600px",
        height: isMobilePortrait ? "940px" : "800px",
      }}
    >
      <div
        className={
          isMobilePortrait
            ? "mobile-crop-grid-wrapper content-counter-rotate-mobile"
            : "flex justify-center items-center h-full w-[90%] mt-[2px]"
        }
      >
        <CropGrid
          selectedCrop={selectedCrop}
          onSelect={
            !gameOver && guesses.length < 6 ? setSelectedCrop : () => { }
          }
          crops={crops}
          isMuted={!gameOver && guesses.length < 6 ? isMuted : true}
          className={isMobilePortrait ? "content-counter-rotate-mobile" : ""}
          isMobilePortrait={isMobilePortrait}
        />
      </div>

      <div
        className={`flex flex-col align-center w-full place-items-center ${isMobilePortrait ? "content-counter-rotate-mobile" : ""
          }`}
      >
        <div
          className={`flex flex-row items-center h-full ${isMobilePortrait ? "mr-6" : "mr-24"
            } mt-[80px] gap-4`}
        >
          <div
            className="relative bg-no-repeat bg-contain"
            style={{
              backgroundImage: "url('/images/selected-frame.webp')",
              width: "240px",
              height: "164px",
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
            <div
              className="flex items-center justify-center bg-center bg-no-repeat bg-contain"
              style={{
                backgroundImage: "url('/images/name-banner.webp')",
                width: "416px",
                height: "76px",
              }}
            >
              <p className="text-5xl text-center text-[#BC6131] tracking-wide">
                {selectedCrop ? formatName(selectedCrop.name) : ""}
              </p>
            </div>

            {gameOver &&
              (guesses[5] ? guesses[5].crop.name === correctCrop.name : true) ? (
              <div className="mt-4 flex items-center justify-center gap-4">
                <p className="text-green-700 text-5xl font-bold whitespace-nowrap">
                  You guessed it!
                </p>

                <div
                  onClick={() => {
                    if (!isMuted) {
                      new Audio("/sounds/modal.mp3").play();
                    }
                    setShowShareModal(true);
                  }}
                  className="w-[40px] h-[40px] cursor-pointer z-10"
                >
                  <div className="clickable w-full h-full relative group">
                    <img
                      src="/images/share-button.webp"
                      alt="Share"
                      className="w-full h-full transition-opacity duration-200 group-hover:opacity-0"
                    />
                    <img
                      src="/images/share-button-hover.webp"
                      alt="Share Hover"
                      className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    />
                  </div>
                </div>
              </div>
            ) : guesses.length >= 6 ? (
              <>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <p className="text-red-600 text-5xl font-bold whitespace-nowrap">
                    Better luck next time!
                  </p>
                  <div
                    onClick={() => {
                      if (!isMuted) {
                        new Audio("/sounds/modal.mp3").play();
                      }
                      setShowShareModal(true);
                    }}
                    className="w-[40px] h-[40px] cursor-pointer z-10"
                  >
                    <div className="clickable w-full h-full relative group">
                      <img
                        src="/images/share-button.webp"
                        alt="Share"
                        className="w-full h-full transition-opacity duration-200 group-hover:opacity-0"
                      />
                      <img
                        src="/images/share-button-hover.webp"
                        alt="Share Hover"
                        className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      />
                    </div>
                  </div>
                </div>
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
                  height: "80px",
                }}
              >
                <img
                  src="/images/submit-button.webp"
                  alt="Submit"
                  className="w-full h-full transition-opacity duration-200 group-hover:opacity-0"
                />
                <img
                  src="/images/submit-button-hover.webp"
                  alt="Submit Hover"
                  className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
              </div>
            )}
          </div>
        </div>
        <div
          className={`${isMobilePortrait ? "" : "mr-[78px]"
            } pl-9 mb-[84px] bg-center bg-no-repeat bg-cover min-h-[440px]`}
          style={{
            backgroundImage: "url('/images/guesses.webp')",
            width: "772px",
            height: "456px",
          }}
        >
          <GuessGrid guesses={guesses} answer={correctCrop} />
        </div>
      </div>
      <div
        onClick={() => {
          if (!isMuted) {
            new Audio("/sounds/modal.mp3").play();
          }
          setShowUpdates(true);
        }}
        className={`absolute -top-14 left-1 w-[50px] h-[50px] group clickable z-10 ${isMobilePortrait ? "content-counter-rotate-mobile" : ""
          }`}
      >
        <img
          src="/images/question-mark.webp"
          alt="Updates"
          className="w-full h-full transition-opacity duration-200 group-hover:opacity-0"
        />
        <img
          src="/images/question-mark-hover.webp"
          alt="Updates Hover"
          className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      </div>
      {showUpdates && (
        <UpdatesModal isMuted={isMuted} onClose={() => setShowUpdates(false)} />
      )}
      <div
        onClick={() => {
          if (!isMuted) {
            new Audio("/sounds/pluck.mp3").play();
          }
          setShowHints(!showHints);
        }}
        className={`absolute -top-11 left-[4%] w-[30px] h-[30px] clickable z-10 ${isMobilePortrait ? "content-counter-rotate-mobile" : ""
          }`}
      >
        <img
          src={showHints ? "/images/question-mark.webp" : "/images/unmuted.webp"}
          alt="Toggle Hints"
          className="w-full h-full"
        />
      </div>
      <div
        onClick={() => {
          if (isMuted) {
            new Audio("/sounds/pluck.mp3").play();
          }
          toggleMute();
        }}
        className={`absolute -top-11 right-[4%] w-[30px] h-[30px] clickable z-10 ${isMobilePortrait ? "content-counter-rotate-mobile" : ""
          }`}
      >
        <img
          src={isMuted ? "/images/muted.webp" : "/images/unmuted.webp"}
          alt="Toggle Sound"
          className="w-full h-full"
        />
      </div>
      <div
        onClick={() => {
          if (!isMuted) {
            new Audio("/sounds/modal.mp3").play();
          }
          setShowHelp(true);
        }}
        className={`absolute -top-14 right-1 w-[50px] h-[50px] group clickable z-10 ${isMobilePortrait ? "content-counter-rotate-mobile" : ""
          }`}
      >
        <img
          src="/images/question-mark.webp"
          alt="Help"
          className="w-full h-full transition-opacity duration-200 group-hover:opacity-0"
        />
        <img
          src="/images/question-mark-hover.webp"
          alt="Help Hover"
          className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      </div>
      {showHelp && (
        <HelpModal isMuted={isMuted} onClose={() => setShowHelp(false)} />
      )}
      {showShareModal && (
        <ShareModal
          shareText={shareText}
          correctGuesses={correctGuesses}
          totalGuesses={totalGuesses}
          timeLeft={timeLeft}
          onClose={() => setShowShareModal(false)}
          isMuted={isMuted}
        />
      )}
    </div>
  );
}
