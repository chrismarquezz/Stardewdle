import { useEffect, useState } from "react";
import CropCard from "./CropCard";

export default function CropGrid({ selectedCrop, onSelect, isMuted, className, isMobilePortrait }) { // Add isMobilePortrait to props
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

  // Define grid styles based on orientation
  const gridStyles = isMobilePortrait
    ? {
        gridTemplateColumns: "repeat(9, 60px)", // Invert columns (e.g., from 8 to 4)
        gridAutoRows: "60px", // Keep row height the same
      }
    : {
        gridTemplateColumns: "repeat(8, 60px)", // Original desktop columns
        gridAutoRows: "60px",
      };

  return (
    <div
      className={`flex justify-center items-center h-full w-[90%] mt-[2px] ${className}`}
      style={{
        backgroundImage: "url('/images/cropgrid-bg.png')",
        backgroundSize: isMobilePortrait ? "80% 80%" : "90% 80%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="grid gap-[6px] place-items-center"
        style={gridStyles} // Apply dynamic grid styles
      >
        {crops.map((crop) => (
          <CropCard
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