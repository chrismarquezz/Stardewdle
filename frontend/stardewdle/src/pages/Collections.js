import { useNavigate} from "react-router-dom";
import { useSound } from "../context/SoundContext";

export default function Gallery() {
  const { isMuted } = useSound();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      />

      {/* Vignette + Blur Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: "blur(5px)", // Adjust blur strength here
          WebkitBackdropFilter: "blur(5px)", // For Safari support
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen w-full flex flex-col items-center">
        <div className="w-full flex justify-center pt-2">
          <div
            onClick={() => {
              if (!isMuted) {
                new Audio("/sounds/mouseClick.mp3").play();

              }
              navigate("/");
            }}
            className="relative w-[624px] cursor-pointer group transform transition-transform duration-200 hover:scale-105"
          >
            <img
              src="/images/stardewdleLogo.png"
              alt="Stardewdle Home"
              className="w-full transition-opacity duration-200 group-hover:opacity-0"
            />
            <img
              src="/images/stardewdleLogo.png"
              alt="Stardewdle Home Hover"
              className="absolute top-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            />
          </div>
        </div>
        <img
          src="/images/construction.png"
          alt="Collections"
          className="w-[192px] mt-20 mb-20">
        </img>
        <h3 className="text-6xl text-white">
          This page is currently under construction!
        </h3>
      </div>
    </div>
  );
}
