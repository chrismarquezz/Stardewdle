import { useState, useEffect } from "react";
import CropGrid from "./CropGrid";
import GuessGrid from "./GuessGrid";


function formatName(name) {
  return name
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export default function GameBox() {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [correctCrop, setCorrectCrop] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

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
      setSelectedCrop(null);
      if (isWin) {
  setGameOver(true);
  new Audio("/sounds/reward.mp3").play().catch((e) =>
    console.warn("Failed to play reward sound:", e)
  );
}

    } catch (error) {
      console.error("Error submitting guess:", error);
    }
  };

  if (!correctCrop || crops.length === 0) {
    return (
      <div className="text-center text-gray-600 text-xl mt-12">
        Loading crop of the day...
      </div>
    );
  }

  return (
    <div
  className="relative flex flex-row gap-10 p-8 shadow-xl bg-no-repeat bg-center mt-20"

      style={{
        backgroundImage: "url('/images/box-bg.png')",
        backgroundSize: "100% 100%",
        width: "1400px",
      }}
    >
      {/* Crop Grid */}
      <div className="w-[576px] mt-[100px]">
        <CropGrid
          selectedCrop={selectedCrop}
          onSelect={setSelectedCrop}
          crops={crops}
        />
      </div>

      {/* Right Side */}
      <div className="flex flex-col justify-between w-full pr-4">
        {/* Selected Crop Display */}
        <div className="flex flex-col items-center mb-10">
          {/* Crop image in center of frame */}
          <div
  className="relative w-[140px] h-[140px] bg-center bg-no-repeat bg-contain"
  style={{
    backgroundImage: "url('/images/selected-frame.png')"
  }}
>
  {selectedCrop && (
  <img
    src={selectedCrop.image_url}
    alt={selectedCrop.name}
    className="absolute top-1/2 left-1/2 w-19 h-19 object-contain -translate-x-1/2 -translate-y-1/2"
  />
)}

</div>

          {/* Name on banner */}
          <div
  className="mt-4 w-[200px] h-[40px] flex items-center justify-center bg-center bg-no-repeat bg-contain"
  style={{
    backgroundImage: "url('/images/name-banner.png')"
  }}
>
  <p className="text-lg font-semibold text-center text-black tracking-wide">
    {selectedCrop ? formatName(selectedCrop.name) : ""}
  </p>
</div>


          {/* Submit Button */}
          <div
            onClick={() => {
              if (!selectedCrop || guesses.length >= 6 || gameOver) return;
              handleSubmit();
            }}
            className={`relative w-[90px] h-[30px] mt-4 group ${
              !selectedCrop || guesses.length >= 6 || gameOver
                ? "opacity-40 pointer-events-none"
                : "cursor-pointer hover:scale-105 transition-transform"
            }`}
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
        </div>

        {/* Guess Grid */}
        <GuessGrid guesses={guesses} answer={correctCrop} />

        {gameOver && (
          <p className="mt-4 text-green-700 text-xl font-bold text-center">You guessed it!</p>
        )}
      </div>

      {/* Help Button */}
      <div
  onClick={() => setShowHelp(true)}
  className="absolute bottom-0 -right-16 w-[50px] h-[50px] group cursor-pointer z-10"
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
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-white max-w-lg w-full rounded-2xl p-8 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">How to Play</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Select a crop from the grid.</li>
              <li>Click "Submit" to guess the crop of the day.</li>
              <li>You get 6 tries to guess the correct crop.</li>
              <li>
                The grid will show feedback:
                <ul className="ml-4 list-disc">
                  <li><span className="text-green-600 font-semibold">Green</span>: exact match</li>
                  <li><span className="text-yellow-500 font-semibold">Yellow</span>: partial match</li>
                  <li><span className="text-red-600 font-semibold">Red</span>: incorrect</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
