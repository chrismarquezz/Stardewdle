import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
  className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center"
  style={{ backgroundImage: "url('/images/background.jpg')" }}
>
  {/* Title near top */}
  <img
    src="/images/stardewdleTitle.png"
    alt="Stardewdle Title"
    className="w-[900px] mt-20 mb-20"
  />

  {/* Button group centered vertically in remaining space */}
  <div className="flex flex-col items-center justify-center flex-grow gap-10">
    {/* Play Button */}
    <div
      onClick={() => navigate("/crops/daily")}
      className="relative w-[400px] cursor-pointer group transform transition-transform duration-200 hover:scale-105"
    >
      <img
        src="/images/play-button.png"
        alt="Play"
        className="w-full transition-opacity duration-200 group-hover:opacity-0"
      />
      <img
        src="/images/play-button-hover.png"
        alt="Play Hover"
        className="absolute top-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />
    </div>

    {/* Collections Button */}
    <div
      onClick={() => navigate("/gallery/crops")}
      className="relative w-[400px] cursor-pointer group transform transition-transform duration-200 hover:scale-105"
    >
      <img
        src="/images/collections-button.png"
        alt="Collections"
        className="w-full transition-opacity duration-200 group-hover:opacity-0"
      />
      <img
        src="/images/collections-button-hover.png"
        alt="Collections Hover"
        className="absolute top-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />
    </div>
  </div>
</div>

  );
}
