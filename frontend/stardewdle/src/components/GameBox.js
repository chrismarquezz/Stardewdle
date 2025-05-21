import { useState } from "react";
import CropGrid from "./CropGrid";

export default function GameBox() {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [guesses, setGuesses] = useState([]);


  const handleSubmit = () => {
  if (selectedCrop) {
    setGuesses([...guesses, selectedCrop]);
    setSelectedCrop(null);
  }
};


  return (
    <div className="flex flex-row gap-6 p-6 bg-white rounded-3xl shadow-xl">
  {/* Left: Grid */}
  <div className="w-[576px]">
    <CropGrid selectedCrop={selectedCrop} onSelect={setSelectedCrop} />
  </div>

  {/* Right: Selected + Submit + Guesses */}
  <div className="flex flex-col justify-between min-w-[280px]">
    {/* Selected Crop Display */}
    <div className="text-center min-h-[150px] flex flex-col items-center justify-center">
  <p className="text-xl font-semibold mb-4">Selected Crop:</p>

  {selectedCrop ? (
    <>
      <img
        src={selectedCrop.image}
        alt={selectedCrop.name}
        className="w-24 h-24"
      />
      <p className="mt-2 text-lg">{selectedCrop.name}</p>
    </>
  ) : (
    <>
      <div className="w-24 h-24 bg-gray-200 rounded border border-gray-300" />
      <p className="mt-2 text-lg text-gray-400">No crop selected</p>
    </>
  )}
</div>


    {/* Submit Button */}
    <div className="mt-6 flex justify-center">
      <button
        onClick={handleSubmit}
        disabled={!selectedCrop || guesses.length >= 6}
        className="bg-green-600 text-white text-xl font-bold px-6 py-3 rounded-2xl hover:bg-green-700 transition disabled:opacity-50"
      >
        Submit
      </button>
    </div>

    {/* Guess History */}
<div className="w-full mt-8">
  <h2 className="text-lg font-semibold mb-2">Your Guesses:</h2>
  <div className="grid grid-cols-1 gap-2">
    {Array.from({ length: 6 }).map((_, index) => {
      const crop = guesses[index];

      return (
        <div
          key={index}
          className="flex items-center space-x-2 border border-gray-300 rounded px-3 py-1 bg-gray-50 h-12"
        >
          {crop ? (
            <>
              <img src={crop.image} alt={crop.name} className="w-6 h-6" />
              <p className="text-sm font-medium">{crop.name}</p>
            </>
          ) : (
            <p className="text-sm text-gray-400">Empty</p>
          )}
        </div>
      );
    })}
  </div>
</div>
  </div>
</div>

  );
}
