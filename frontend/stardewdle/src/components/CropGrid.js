import CropCard from "./CropCard";
import crops from "../data/crops.json";

export default function CropGrid({ selectedCrop, onSelect }) {
  return (
    <div
  className="grid gap-0"
  style={{
    gridTemplateColumns: "repeat(9, 64px)",
    gridAutoRows: "64px"
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
