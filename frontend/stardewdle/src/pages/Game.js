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

      // Determine if current orientation is mobile portrait
      const currentlyIsMobilePortrait =
        window.innerWidth < 768 && window.innerHeight > window.innerWidth;
      setIsMobilePortrait(currentlyIsMobilePortrait);

      // Scaling factor calculation:
      // If mobile portrait, we're effectively fitting a 900x1600 content into screen.
      // So, swap design dimensions for scale calculation to ensure it fits.
      let effectiveDesignWidth = designWidth;
      let effectiveDesignHeight = designHeight;
      if (currentlyIsMobilePortrait) {
        effectiveDesignWidth = designHeight; // 900
        effectiveDesignHeight = designWidth; // 1600
      }

      const scaleW = maxWidth / effectiveDesignWidth;
      const scaleH = maxHeight / effectiveDesignHeight;

      setScaleFactor(Math.min(scaleW, scaleH));
    };

    handleResize(); // Call on mount
    window.addEventListener("resize", handleResize); // Re-evaluate on resize
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
        }}
      />

      {/* Outer game container: Scales the entire UI to fit screen */}
      {/* This div acts as the positioning context for the contained elements */}
      <div className={`absolute z-10 w-full h-full flex justify-center items-center ${isMobilePortrait ? "top-2" : "-top-2"}`}>
        <div
          // This div acts as the main content frame, scaling the overall game.
          // It's a flex-column to stack the logo and gamebox wrapper.
          className="flex flex-col items-center"
          style={{
            width: "1600px", // Fixed design width
            height: isMobilePortrait ? "800px" : "900px", // Fixed design height
            transform: `scale(${scaleFactor})`, // Apply overall scaling
            transformOrigin: "center center",
          }}
        >
          {/* Logo Button - Remains static at the top, not rotated */}
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

          {/* New wrapper for GameBox: Handles its own rotation and positioning for mobile */}
          <div className="gamebox-wrapper">
            <GameBox isMobilePortrait={isMobilePortrait} />
          </div>
        </div>
      </div>
    </div>
  );
}