import { useState, useEffect } from "react";
import CropGrid from "./CropGrid";
import GuessGrid from "./GuessGrid";
import crops from "../data/crops.json";

function formatName(name) {
  return name
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export default function GameBox() {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [correctCrop, setCorrectCrop] = useState(null);

  // Fetch the word of the day from the API
  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch(
          "https://2vo847ggnb.execute-api.us-east-1.amazonaws.com/word"
        );
        const data = await response.json();
        const word = data.word;

        const cropData = crops.find(
          (crop) => crop.name.toLowerCase() === word.toLowerCase()
        );

        if (cropData) {
          setCorrectCrop(cropData);
        } else {
          console.warn("Crop not found for word:", word);
        }
      } catch (error) {
        console.error("Failed to fetch word of the day:", error);
      }
    };

    fetchWord();
  }, []);

  const handleSubmit = async () => {
    if (!selectedCrop || guesses.length >= 6 || gameOver) return;

    try {
      const response = await fetch(
        "https://2vo847ggnb.execute-api.us-east-1.amazonaws.com/guess",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ guess: selectedCrop.name })
        }
      );

      const data = await response.json();
      const result = data.result;

      const newGuess = { crop: selectedCrop, result };
      const updatedGuesses = [...guesses, newGuess];

      // Check if user won (all match)
      const isWin =
        result && Object.values(result).every((val) => val === "match");

      setGuesses(updatedGuesses);
      setSelectedCrop(null);

      if (isWin) {
        setGameOver(true);
      }
    } catch (error) {
      console.error("Error submitting guess:", error);
    }
  };

  if (!correctCrop) {
    return (
      <div className="text-center text-gray-600 text-xl mt-12">
        Loading crop of the day...
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-6 p-6 bg-white rounded-3xl shadow-xl">
      {/* Left: Grid */}
      <div className="w-[576px]" style={{ marginTop: "100px" }}>
        <CropGrid selectedCrop={selectedCrop} onSelect={setSelectedCrop} />
      </div>

      {/* Right: Selected + Submit + Guesses */}
      <div className="flex flex-col justify-between min-w-[280px]">
        {/* Selected Crop Display */}
        <div className="flex items-center gap-6 mb-8">
          <p className="text-xl font-semibold">Selected Crop:</p>
          <div className="flex flex-col items-center">
  {selectedCrop ? (
    <>
      <img
        src={selectedCrop.image_url}
        alt={selectedCrop.name}
        className="w-24 h-24 object-contain"
      />
      <p className="mt-2 text-lg font-semibold text-center">
        {formatName(selectedCrop.name)}
      </p>
    </>
  ) : (
    <>
      <div className="w-24 h-24 bg-gray-200 rounded border border-gray-300" />
      <p className="mt-2 text-lg text-gray-400 text-center">No crop selected</p>
    </>
  )}
</div>

          <button
            onClick={handleSubmit}
            disabled={!selectedCrop || guesses.length >= 6 || gameOver}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            Submit
          </button>
        </div>

        {/* Guess Grid */}
        <GuessGrid guesses={guesses} answer={correctCrop} />

        {gameOver && (
          <p className="mt-4 text-green-700 text-xl font-bold text-center">
            You guessed it!
          </p>
        )}
      </div>
    </div>
  );
}
