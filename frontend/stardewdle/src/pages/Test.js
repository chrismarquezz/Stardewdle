import { useState, useEffect } from "react";

export default function Test() {
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const maxWidth = window.innerWidth * 0.95; 
      const maxHeight = window.innerHeight * 0.95;

      const designWidth = 1080;
      const designHeight = 720; 

      const scaleW = maxWidth / designWidth;
      const scaleH = maxHeight / designHeight;

      setScaleFactor(Math.min(scaleW, scaleH));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-y-auto">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      />

      {/* Scaled Content */}
      <div className="relative z-10 w-full h-full flex justify-center overflow-hidden">
        <div
          style={{
            width: "1080px", 
            height: `${720 * scaleFactor}px`, 
            transform: `scale(${scaleFactor})`,
            transformOrigin: "top center",
          }}
          className="flex flex-col items-center justify-center"
        >
          
          <img
            src="/images/construction.webp"
            alt="Under Construction"
            className="h-[20%]"
          />
            
        </div>
      </div>
    </div>
  );
}
