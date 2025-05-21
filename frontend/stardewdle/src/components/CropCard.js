export default function CropCard({ crop, isSelected, onClick }) {
  return (
    <div
      onClick={() => onClick(crop)}
      className={`cursor-pointer border-2 rounded-md transition ${
        isSelected ? "border-green-500" : "border-transparent"
      } hover:border-green-300`}
      style={{
        width: "64px",   // adjust this value as needed
        height: "64px",  // adjust this value as needed
        padding: "4px"
      }}
    >
      <img
        src={crop.image}
        alt={crop.name}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

