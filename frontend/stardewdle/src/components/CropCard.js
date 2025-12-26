import { formatName } from "../utils/formatString";

export default function CropCard({ crop, isSelected, onClick, isMuted, guessable, isMobilePortrait }) {
  const formattedName = formatName(crop.name);

  return (
    <div
      onClick={() => {
        if (!guessable) return;
        if (!isMuted) {
          new Audio("/sounds/select.mp3").play();
        }
        onClick(crop);
      }}
      className={`relative w-16 h-16 p-1 flex items-center justify-center group ${
        isSelected ? "border-4 border-green-400" : "border-0 border-transparent"
      } ${guessable ? "clickable" : ""}`}
      style={{
        backgroundImage: "url('/images/tile-bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        scale: isMobilePortrait ? "1.1" : "1",
      }}
    >
      <img
        src={crop.image_url}
        alt={crop.name}
        className={`object-contain w-[100%] h-[100%] p-[2px] pl-[6px] pb-[6px]`}
      />
      
      <div
        className={`w-full h-full absolute opacity-70 mix-blend-multiply ${
          guessable ? "" : "bg-gray-500"
        }`}
      />
      <div
        className="absolute -top-5 left-1/2 -translate-x-1/2 px-3 py-1 flex items-center justify-center text-xl font-medium text-[#BC6131] text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap"
        style={{
          backgroundImage: "url('/images/label.webp')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          height: "28px",
        }}
      >
        {formattedName}
      </div>
    </div>
  );
}
