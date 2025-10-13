export default function CollectionsCard({
  crop,
  isSelected,
  onClick,
  isMuted,
}) {
  const formattedName = crop.name
    .replace(/_/g, " ")
    .replace(
      /\w\S*/g,
      (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    );

  return (
    <div
      onClick={() => {
        if (!isMuted) {
          new Audio("/sounds/select.mp3").play();
        }

        onClick(crop);
      }}
      className={`relative w-16 h-16 clickable p-1 flex items-center justify-center group ${isSelected ? "border-4 border-green-400" : "border-0 border-transparent"
        }`}
      style={{
        backgroundImage: "url('/images/collections/collectionsItemBoxAlt.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Crop Image */}
      <img
        src={crop.image_url}
        alt={crop.name}
        className="w-[80%] h-[80%] object-contain"
      />

      {/* Custom Label Tooltip */}
      <div
        className="absolute -top-5 left-1/2 -translate-x-1/2 px-3 py-1 flex items-center justify-center text-xl font-medium text-[#D5C9AC] text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap"
        style={{
          backgroundImage: "url('/images/collections/collectionsLabel.webp')",
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
