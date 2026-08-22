import React from 'react';

export default function SpriteZoomReveal({
    sheetName,
    colIndex,
    rowIndex = 0,
    spriteSize = 48,
    visibleSize = 2, // Now represents ACTUAL 16x16 art pixels
    originX = 50,
    originY = 50
}) {

    const scaleFactor = 16 / visibleSize * 4;

    return (
        <div
            className="overflow-hidden bg-black/5 rounded-lg"
            style={{ width: '192px', height: '192px', position: 'relative' }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: `${spriteSize}px`,
                    height: `${spriteSize}px`,
                    transform: `translate(-50%, -50%) scale(${scaleFactor})`,
                    transformOrigin: `${originX}% ${originY}%`,
                    transition: 'all 0.3s ease-out',
                    backgroundImage: `url(${import.meta.env.VITE_BUCKET_URL}/sprites/${sheetName}.webp?v=20260821)`,
                    backgroundPosition: `-${colIndex * spriteSize}px -${rowIndex * spriteSize}px`,
                    backgroundRepeat: 'no-repeat',
                    imageRendering: 'pixelated',
                }}
            />
        </div>
    );
}