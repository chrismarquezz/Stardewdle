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
      const maxWidth = window.innerWidth * 0.95; // 95% of screen width
      const maxHeight = window.innerHeight * 0.95; // 95% of screen height

      const baseDesignWidth = 1600; // Original design width
      const baseDesignHeight = 900; // Original design height

      // Check if it's considered mobile and in portrait mode
      const currentlyIsMobilePortrait = window.innerWidth < 768 && window.innerHeight > window.innerWidth;
      setIsMobilePortrait(currentlyIsMobilePortrait);

      let effectiveDesignWidth = baseDesignWidth;
      let effectiveDesignHeight = baseDesignHeight;

      // If in mobile portrait, calculate scale factor based on swapped dimensions
      // This is for determining how much to shrink the (effectively) rotated game.
      if (currentlyIsMobilePortrait) {
        effectiveDesignWidth = baseDesignHeight; // New effective width is original height
        effectiveDesignHeight = baseDesignWidth; // New effective height is original width
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

      {/* Scaled Content - This is the main game container */}
      <div className="relative z-10 w-full h-full flex justify-center items-center">
        <div
          style={{
            // Set the width/height of this div to reflect the *logical* dimensions
            // it will occupy after rotation. This helps the parent flexbox center it.
            width: isMobilePortrait ? "900px" : "1600px", // Swap width/height here for layout
            height: isMobilePortrait ? "1600px" : "900px", // Swap width/height here for layout
            // Apply scale and rotation directly
            transform: `scale(${scaleFactor}) ${isMobilePortrait ? 'rotate(-90deg)' : ''}`,
            transformOrigin: "center center", // Crucial for correct rotation and scaling
            // For fine-tuning positioning after rotation on *some* browsers/setups,
            // you might sometimes need an additional translate, but the dynamic
            // width/height with flex centering should largely handle it.
            // Example: `translate(${isMobilePortrait ? (900-1600)/2 : 0}px, ${isMobilePortrait ? (1600-900)/2 : 0}px)`
            // However, starting without it is best, as it often causes issues.
          }}
          // The class name 'game-container-mobile-portrait' is not strictly needed here if you apply styles inline
          // But if you had complex CSS rules specific to the outer container, you'd use it.
        >
          {/* Logo + Game Content */}
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

          {/* Pass isMobilePortrait to GameBox so its children can counter-rotate */}
          <GameBox isMobilePortrait={isMobilePortrait} />
        </div>
      </div>
    </div>
  );
}