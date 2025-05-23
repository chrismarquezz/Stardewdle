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
    <div className="flex justify-center items-center w-full h-full w-[90%] mt-[2px]"
    style={{
        backgroundImage: "url('/images/cropgrid-bg.png')",
        backgroundSize: "80% 80%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="grid gap-[6px] place-items-center"
        style={{
          gridTemplateColumns: "repeat(8, 60px)",
          gridAutoRows: "60px",
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
    </div>
  );
}
