import { useState, useEffect } from "react";
import { useSound } from "../../context/SoundContext";
import CollectionsGrid from "./CollectionsGrid";
import CropLoader from "../CropLoader";

const DAILY_RESET_ENABLED = false; // Set to true to re-enable

function formatName(name) {
  return name
    .replace(/_/g, " ")
    .replace(
      /\w\S*/g,
      (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    );
}

export default function CollectionsBox() {
  const [selectedCrop, setSelectedCrop] = useState(() => {
    const saved = localStorage.getItem("stardewdle-selectedCrop");
    return saved ? JSON.parse(saved) : null;
  });

  const [crops, setCrops] = useState([]);
  const { isMuted, toggleMute } = useSound();

  useEffect(() => {
    if (crops.length === 0) {
      const fetchInitialData = async () => {
        try {
          const cropURL = "https://stardewdle-data.s3.amazonaws.com/crops.json";
          const cropResponse = await fetch(cropURL);
          const cropList = await cropResponse.json();
          setCrops(cropList);

        } catch (error) {
          console.error("Failed to fetch crop data or word:", error);
        }
      };

      fetchInitialData();
    }
  }, []); // <-- Empty dependencies, runs once on mount

  if (crops.length === 0) {
    return <CropLoader />;
  }

  return (
    <div
      className="relative flex flex-row shadow-xl bg-no-repeat bg-center mt-3 justify-between w-full pl-3"
      style={{
        backgroundImage: "url('/images/collections/collectionsBG.png')",
        backgroundSize: "100% 100%",
        width: "1600px",
        height: "800px",
        transform: "scale(0.95)",
      }}
    >
      {/* Crop Grid */}
      <CollectionsGrid
        selectedCrop={selectedCrop}
        onSelect={setSelectedCrop}
        crops={crops}
        isMuted={isMuted}
      />

      {/* Right Side */}
      <div className="flex flex-col align-center w-full place-items-center">
        {/* Selected Crop Display */}
        <div className="flex flex-col items-center h-full mr-6 mt-[140px] gap-4">
          {/* Crop image in center of frame */}
          <div
            className="relative bg-no-repeat bg-contain"
            style={{
              backgroundImage: "url('/images/collections/collectionsSelected.png')",
              width: "212px",
              height: "212px",
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
          {selectedCrop ? (
            <>
              <p className="text-7xl text-center text-[#c9ba98]">
                {formatName(selectedCrop.name)}
                <hr className="w-[400px] mt-4 border-t-4 border-[#c9ba98] mx-auto" />

              </p>

              <p className="text-4xl text-center text-[#c9ba98] tracking-wide">
                {formatName(selectedCrop.type)} <br />
                Grows in {selectedCrop.growth_time} days <br />
                Sells for {selectedCrop.base_price}g <br />
                Does {selectedCrop.regrows ? "" : "not"} regrow  <br />
                <div className="flex gap-1 items-center justify-center">
                  Grows during: {(selectedCrop.season == "all"
                    ? ["spring", "summer", "fall", "winter"]
                    : Array.isArray(selectedCrop.season) 
                      ? selectedCrop.season.map((s) => s.toLowerCase())
                      : []
                  ).map((season) => (
                    <div key={season} className="relative group flex items-center justify-center gap-3">
                      <img
                        src={`/images/${season}.png`}
                        alt={season}
                        className="h-8 w-12"
                      />
                      <div
                        className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 flex items-center justify-center text-xl font-medium text-[#c9ba98] text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap"
                        style={{
                          backgroundImage: "url('/images/collections/collectionsLabel.png')",
                          backgroundSize: "100% 100%",
                          backgroundRepeat: "no-repeat",
                          height: "28px"
                        }}
                      >
                        {season.charAt(0).toUpperCase() + season.slice(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </p>
            </>
          ) : ("")
          }
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
        className="absolute bottom-2 -right-10 w-[30px] h-[30px] clickable z-10"
      >
        <img
          src={isMuted ? "/images/muted.png" : "/images/unmuted.png"}
          alt="Toggle Sound"
          className="w-full h-full"
        />
      </div>
      {/* Mute/Unmute Button */}
    </div>
  );
}