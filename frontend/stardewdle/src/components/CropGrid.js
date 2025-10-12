import { useEffect, useState } from "react";
import CropCard from "./CropCard";

function checkConstraints(constraints, crop) {
  if (
    constraints["name"].includes(crop.name) ||
    constraints["growth_time"].includes(crop.growth_time) ||
    constraints["base_price"].includes(crop.base_price) ||
    constraints["regrows"].includes(crop.regrows) ||
    constraints["type"].includes(crop.type) ||
    constraints["season"].includes(crop.season)
  ) {
    return true;
  }
}

export default function CropGrid({
  selectedCrop,
  onSelect,
  isMuted,
  className,
  isMobilePortrait,
  constraints,
  showHints,
}) {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    if (crops.length === 0) {
      const fetchInitialData = async () => {
        try {
          const cropResponse = await fetch(
            process.env.REACT_APP_API_URL + "/crops"
          );

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

  const gridStyles = isMobilePortrait
    ? {
        gridTemplateColumns: "repeat(9, 60px)",
        gridAutoRows: "60px",
      }
    : {
        gridTemplateColumns: "repeat(8, 60px)",
        gridAutoRows: "60px",
      };

  return (
    <div
      className={`flex justify-center items-center h-full w-[90%] mt-[2px] ${className}`}
      style={{
        backgroundImage: "url('/images/cropgrid-bg.webp')",
        backgroundSize: isMobilePortrait ? "80% 80%" : "90% 80%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="grid gap-[6px] place-items-center" style={gridStyles}>
        {crops.map((crop) => {
          const isGuessable = showHints
            ? !checkConstraints(constraints, crop)
            : true;

          return (
            <CropCard
              key={crop.name}
              crop={crop}
              isSelected={selectedCrop?.name === crop.name}
              onClick={onSelect}
              isMuted={isMuted}
              guessable={isGuessable}
            />
          );
        })}
      </div>
    </div>
  );
}
