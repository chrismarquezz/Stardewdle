import { useEffect, useState } from "react";
import CollectionsCard from "./CollectionsCard";

export default function CollectionsGrid({ selectedCrop, onSelect, isMuted, className, isMobilePortrait }) {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const cropURL = "https://stardewdle-data.s3.amazonaws.com/crops.json";
        const response = await fetch(cropURL);
        const data = await response.json();
        setCrops(data);
      } catch (error) {
        console.error("Failed to fetch crops:", error);
      }
    };

    fetchCrops();
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
    >
      <div
        className="grid gap-[6px] place-items-center"
        style={gridStyles}

      >
        {crops.map((crop) => (
          <CollectionsCard
            key={crop.name}
            crop={crop}
            isSelected={selectedCrop?.name === crop.name}
            onClick={onSelect}
            isMuted={isMuted}
          />
        ))}
      </div>
    </div>
  );
}
