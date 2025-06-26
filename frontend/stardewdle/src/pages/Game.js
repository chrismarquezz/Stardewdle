import { useNavigate } from "react-router-dom";
import { useSound } from "../context/SoundContext";
import { useState, useEffect } from "react";
import GameBox from "../components/GameBox";

export default function Game() {
  const { isMuted } = useSound();
  const navigate = useNavigate();
  const [scaleFactor, setScaleFactor] = useState(1);
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const maxWidth = window.innerWidth * 0.95;
      const maxHeight = window.innerHeight * 0.95;

      const designWidth = 1600;
      const designHeight = 900;

      const currentlyIsMobilePortrait =
        window.innerWidth < 768 && window.innerHeight > window.innerWidth;
      setIsMobilePortrait(currentlyIsMobilePortrait);

      
      let effectiveDesignWidth = designWidth;
      let effectiveDesignHeight = designHeight;
      if (currentlyIsMobilePortrait) {
        effectiveDesignWidth = designHeight; 
        effectiveDesignHeight = designWidth; 
      }

      const scaleW = maxWidth / effectiveDesignWidth;
      const scaleH = maxHeight / effectiveDesignHeight;

      setScaleFactor(Math.min(scaleW, scaleH));
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/background.webp')" }}
      />

      {/* Vignette + Blur Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
        }}
      />

      <div className={`absolute z-10 w-full h-full flex justify-center items-center ${isMobilePortrait ? "top-2" : "-top-4"}`}>
        <div
          className="flex flex-col items-center"
          style={{
            width: "1600px", 
            height: isMobilePortrait ? "800px" : "900px",
            transform: `scale(${scaleFactor})`,
            transformOrigin: "center center",
          }}
        >
          {/* Logo Button */}
          <div className={`relative ${isMobilePortrait ? "top-[-470px]" : ""}`}>
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
                src="/images/stardewdleLogo.webp"
                alt="Stardewdle Home"
                className="buttonBase"
              />
              <img
                src="/images/stardewdleLogo.webp"
                alt="Stardewdle Home Hover"
                className="buttonHover"
              />
            </div>
          </div>

          <div className="gamebox-wrapper">
            <GameBox isMobilePortrait={isMobilePortrait} />
          </div>
        </div>
      </div>
    </div>
  );
}