import { useState, useEffect } from "react";
import { useSound } from "../../context/SoundContext";
import CollectionsGrid from "./CollectionsGrid";
import CropLoader from "../CropLoader";

function formatName(name) {
  return name
    .replace(/_/g, " ")
    .replace(
      /\w\S*/g,
      (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    );
}

export default function CollectionsBox({ isMobilePortrait }) {
  const [selectedCrop, setSelectedCrop] = useState(null);

  const [crops, setCrops] = useState([]);
  const { isMuted, toggleMute } = useSound();

  useEffect(() => {
    if (crops.length === 0) {
      const fetchInitialData = async () => {
        try {  
          const cropResponse = await fetch("https://2vo847ggnb.execute-api.us-east-1.amazonaws.com/crops");
  
          if (!cropResponse.ok) {
            throw new Error(`HTTP error! status: ${cropResponse.status}`);
          }
  
          const cropList = await cropResponse.json();
          setCrops(cropList);
        } catch (error) {
          console.error("Failed to fetch crop data from Lambda:", error);
        }
      };
  
      fetchInitialData();
    }
  }, []);

  if (crops.length === 0) {
    return <CropLoader className={isMobilePortrait ? "content-counter-rotate-mobile" : ""}/>;
  }

  return (
    <div
      className={`relative shadow-xl bg-no-repeat bg-center ${
        isMobilePortrait ? "collections-box-mobile-layout" : "relative flex flex-row mt-3 justify-between w-full pl-3"
      }`}
      style={{
        backgroundImage: "url('/images/collections/collectionsBG.png')",
        backgroundSize: "100% 100%",
        width: isMobilePortrait ? "1500px" : "1600px", 
        height: isMobilePortrait ? "940px" : "800px",
      }}
    >
      <div
        className={
          isMobilePortrait
            ? "mobile-collections-grid-wrapper content-counter-rotate-mobile"
            : "relative flex flex-row bg-no-repeat mt-3 justify-center w-full pl-3"
        }
      >
        <CollectionsGrid
          selectedCrop={selectedCrop}
          onSelect={setSelectedCrop}
          crops={crops}
          isMuted={isMuted}
          className={isMobilePortrait ? "content-counter-rotate-mobile" : ""}
          isMobilePortrait={isMobilePortrait}
        />
      </div>
      <div className={`flex flex-col align-center w-full place-items-center h-full justify-center ${isMobilePortrait ? "content-counter-rotate-mobile" : ""}`}>
        <div className={`flex flex-col items-center ${isMobilePortrait ? "" : "mr-12 mt-[20px]"} gap-4`}>
          {selectedCrop ? (
            <>
              <p className="text-7xl text-center text-[#c9ba98]">
                {formatName(selectedCrop.name)}
                <p className="w-[500px] border-b-4 border-[#c9ba98] mx-auto text-4xl text-center text-[#c9ba98] pb-2">{selectedCrop.infodetail}</p>
              </p>
              <div className="flex flex-row items-center h-full mr-10 gap-4">
                <div
                  className="relative bg-no-repeat bg-contain"
                  style={{
                    backgroundImage:
                      "url('/images/collections/collectionsSelected.png')",
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
                <p className="text-4xl text-center text-[#c9ba98] tracking-wide">
                  {formatName(selectedCrop.type)} <br />
                  Grows in {selectedCrop.growth_time} days <br />
                  Sells for {selectedCrop.base_price}g <br />
                  Does {selectedCrop.regrows ? "" : "not"} regrow <br />
                  <div className="flex gap-3 items-center justify-center">
                    {"Seasons: "}{" "}
                    {(selectedCrop.season == "all"
                      ? ["spring", "summer", "fall", "winter"]
                      : Array.isArray(selectedCrop.season)
                        ? selectedCrop.season.map((s) => s.toLowerCase())
                        : []
                    ).map((season) => (
                      <div
                        key={season}
                        className="relative group flex items-center justify-center gap-3"
                      >
                        <img
                          src={`/images/${season}.png`}
                          alt={season}
                          className="h-8 w-12"
                        />
                        <div
                          className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 flex items-center justify-center text-xl font-medium text-[#c9ba98] text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap"
                          style={{
                            backgroundImage:
                              "url('/images/collections/collectionsLabel.png')",
                            backgroundSize: "100% 100%",
                            backgroundRepeat: "no-repeat",
                            height: "28px",
                          }}
                        >
                          {season.charAt(0).toUpperCase() + season.slice(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </p>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>

      <div
        onClick={() => {
          if (isMuted) {
            new Audio("/sounds/pluck.mp3").play();
          }
          toggleMute();
        }}
        className={`absolute bottom-2 -right-10 w-[30px] h-[30px] clickable z-10 ${isMobilePortrait ? "content-counter-rotate-mobile" : ""}`}
      >
        <img
          src={isMuted ? "/images/muted.png" : "/images/unmuted.png"}
          alt="Toggle Sound"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}