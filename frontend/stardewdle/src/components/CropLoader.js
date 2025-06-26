import { useState, useEffect } from "react";

const cropImages = [
  "row-1-column-1.webp",
  "row-1-column-2.webp",
  "row-1-column-3.webp",
  "row-1-column-4.webp",
  "row-1-column-5.webp",
  "row-1-column-6.webp",
  "row-1-column-7.webp",
  "row-1-column-8.webp",
];

export default function CropLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % cropImages.length);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center mt-12">
      <img
        src={`/images/loading/${cropImages[index]}`}
        alt="Loading crop"
        className="w-20 h-20 object-contain"
      />
      <p className="mt-4 text-gray-600 text-5xl font-semibold">
        Loading crop of the day...
      </p>
    </div>
  );
}
