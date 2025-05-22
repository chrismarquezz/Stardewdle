export default function CropCard({ crop, isSelected, onClick }) {
  return (
    <div
      onClick={() => onClick(crop)}
      className={`w-16 h-16 cursor-pointer p-1 border ${
        isSelected ? "border-4 border-yellow-400" : "border border-gray-300"
      }`}
      style={{
        backgroundImage: "url('/images/tile-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img
        src={crop.image_url}
        alt={crop.name}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
