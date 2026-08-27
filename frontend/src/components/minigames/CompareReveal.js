import React, { useState } from 'react';
import SpritePixelator from './SpritePixelator';
import SpriteZoomReveal from './SpriteZoomReveal';

export default function CompareReveal() {
    // State to track which sprite on the sheet we are looking at
    const [currentIndex, setCurrentIndex] = useState(0);

    const pixelLevels = [24, 12, 8, 6, 4, 1];
    // 2x2, 4x4, 6x6, 8x8, 12x12, and finally the full 16x16 sprite
    const zoomLevels = [2, 4, 6, 8, 12, 16];
    const handlePrev = () => setCurrentIndex(prev => Math.max(0, prev - 1));
    const handleNext = () => setCurrentIndex(prev => prev + 1);

    return (
        <div className="p-8 bg-[#fcedd2] min-h-screen flex flex-col items-center gap-8 overflow-x-auto relative">

            {/* --- CONTROLS SECTION --- */}
            <div className="sticky top-4 z-50 flex items-center gap-6 bg-white px-6 py-4 rounded-xl border-4 border-[#d5a05a] shadow-lg">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="px-4 py-2 bg-[#BC6131] text-white font-bold rounded-lg hover:bg-[#a05025] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ◀ Previous
                </button>

                <span className="text-xl font-bold text-[#BC6131] min-w-[120px] text-center">
                    Index: {currentIndex}
                </span>

                <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-[#BC6131] text-white font-bold rounded-lg hover:bg-[#a05025] transition-colors"
                >
                    Next ▶
                </button>
            </div>

            {/* --- METHOD 1: PIXELATION --- */}
            <div className="flex flex-col items-center w-full mt-4">
                <div className="flex gap-4">
                    {pixelLevels.map((level, i) => (
                        <div key={`pixel-${i}`} className="flex flex-col items-center gap-2">
                            <span className="font-bold text-[#BC6131]">
                                {i === 5 ? "Complete" : `Guess ${i}`}
                            </span>

                            <div className="w-48 h-48 border-4 border-[#BC6131] rounded-lg overflow-hidden flex items-center justify-center bg-black/5 shadow-inner">
                                <SpritePixelator
                                    sheetName="geology"
                                    colIndex={currentIndex}
                                    pixelBlockLevel={level}
                                />
                            </div>

                            <span className="text-sm font-medium text-gray-600">
                                Block: {level}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- METHOD 2: ZOOM REVEAL --- */}
            <div className="flex flex-col items-center w-full">
                <div className="flex gap-4">
                    {zoomLevels.map((size, i) => (
                        <div key={`zoom-${i}`} className="flex flex-col items-center gap-2">
                            <span className="font-bold text-[#BC6131]">
                                {i === 5 ? "Complete" : `Guess ${i}`}
                            </span>

                            <div className="w-48 h-48 border-4 border-[#BC6131] rounded-lg overflow-hidden flex items-center justify-center bg-black/5 shadow-inner">
                                <SpriteZoomReveal
                                    sheetName="geology"
                                    colIndex={currentIndex}
                                    visibleSize={size}
                                />
                            </div>

                            <span className="text-sm font-medium text-gray-600">
                                Size: {size}x{size}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}