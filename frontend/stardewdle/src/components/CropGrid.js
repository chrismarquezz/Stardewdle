import { useEffect, useState } from "react";
import CropCard from "./CropCard";

export default function CropGrid({ selectedCrop, onSelect }) {
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

  return (
    <div
  className="grid gap-0 ml-20 mb-20 mt-0"
  style={{
    gridTemplateColumns: "repeat(8, 64px)",
    gridAutoRows: "64px",
    width: "512px",
    height: "576px",
  }}
>

      {crops.map((crop) => (
        <CropCard
          key={crop.name}
          crop={crop}
          isSelected={selectedCrop?.name === crop.name}
          onClick={onSelect}
        />
      ))}
    </div>
  );
}
