import GameBox from "../components/GameBox";
import { useNavigate} from "react-router-dom";
import { useSound } from "../context/SoundContext";

export default function Game() {
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
            className="buttonMain w-[624px] h-[114px] clickable"
          >
            <img
              src="/images/stardewdleLogo.png"
              alt="Stardewdle Home"
              className="buttonBase"
            />
            <img
              src="/images/stardewdleLogo.png"
              alt="Stardewdle Home Hover"
              className="buttonHover"
            />
          </div>
        </div>
        <GameBox />
      </div>
    </div>
  );
}