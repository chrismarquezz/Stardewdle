export default function CropCard({ crop, isSelected, onClick }) {
  return (
    <div
      onClick={() => onClick(crop)}
      className={`w-16 h-16 cursor-pointer p-1 flex items-center justify-center ${
        isSelected ? "border-4 border-green-400" : "border-0 border-transparent"
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
        className="w-[80%] h-[80%] object-contain"
      />
    </div>
  );
}
