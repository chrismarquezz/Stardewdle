import CollectionsBox from "../components/collections/CollectionsBox";
import { useNavigate } from "react-router-dom";
import { useSound } from "../context/SoundContext";
import { useState, useEffect } from "react";

export default function Game() {
  const { isMuted } = useSound();
  const navigate = useNavigate();
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const maxWidth = window.innerWidth * 0.95; // 95% of screen width
      const maxHeight = window.innerHeight * 0.95; // 95% of screen height

      const designWidth = 1600; // Your design width (adjust as needed)
      const designHeight = 900; // Your design height (adjust as needed)

      const scaleW = maxWidth / designWidth;
      const scaleH = maxHeight / designHeight;

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

      {/* Scaled Content */}
      <div className="relative z-10 w-full h-full flex justify-center items-center">
        <div
          style={{
            width: "1600px", // Design width
            height: "900px", // Design height
            transform: `scale(${scaleFactor})`,
            transformOrigin: "top center",
          }}
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

          <CollectionsBox />
        </div>
      </div>
    </div>
  );
}
