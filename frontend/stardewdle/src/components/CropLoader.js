import { useState, useEffect } from "react";

const cropImages = [
  "row-1-column-1.png",
  "row-1-column-2.png",
  "row-1-column-3.png",
  "row-1-column-4.png",
  "row-1-column-5.png",
  "row-1-column-6.png",
  "row-1-column-7.png",
  "row-1-column-8.png",
];

export default function CropLoader({className}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % cropImages.length);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
<div className={`flex items-center justify-center ${className ? "h-full w-full" : "h-screen w-screen"}`}>
  <div className={`flex flex-col items-center ${className}`}> 
    <img
      src={`/images/loading/${cropImages[index]}`}
      alt="Loading crop"
      className="w-20 h-20 object-contain"
    />
    <p className="mt-4 text-[#2A0A84] text-5xl text-center">
      Loading crop of the day...
    </p>
  </div>
</div>
  );
}
