import { useState } from "react";
import { useGameData } from "../../context/GameDataContext";
import { formatName } from "../../utils/formatString";
import { getSpriteStyle } from "../../utils/spriteUtils";

import CustomButton from "../CustomButton";

export default function GeologyGame({ gameState, updateGameState, isMobilePortrait, isMuted }) {
    // Note: your GameDataContext maps the geology.json data to the "minerals" state
    const { minerals, dailyData } = useGameData();

    const targetItemIndex = dailyData?.dailyItems?.geology;
    const targetItem = minerals?.[targetItemIndex];

    const [selectedItem, setSelectedItem] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [activeTab, setActiveTab] = useState('A-D'); // Alphabetical filtering

    if (!targetItem) return null;

    const currentGuesses = gameState.guesses || [];
    const maxGuesses = 5;

    // --- DISTORTION LOGIC ---
    // The fewer guesses made, the higher the distortion index.
    const guessesMade = currentGuesses.length;
    const isRevealed = gameState.complete;

    // Array of distortion states: [Scale, Blur(px)]
    const distortionStages = [
        { scale: 5, blur: 8 },   // 0 Guesses (Hardest)
        { scale: 3.5, blur: 5 }, // 1 Guess
        { scale: 2.5, blur: 3 }, // 2 Guesses
        { scale: 1.8, blur: 1.5 }, // 3 Guesses
        { scale: 1.2, blur: 0.5 }, // 4 Guesses
        { scale: 1, blur: 0 }    // 5 Guesses or Win (Revealed)
    ];

    // Lock to the final stage if the game is over, otherwise match the guess count
    const currentStage = isRevealed
        ? distortionStages[5]
        : distortionStages[Math.min(guessesMade, 5)];

    // --- ALPHABETICAL FILTERING ---
    const ALPHABET_GROUPS = [
        { label: 'A-D', regex: /^[A-D]/i },
        { label: 'E-H', regex: /^[E-H]/i },
        { label: 'I-M', regex: /^[I-M]/i },
        { label: 'N-S', regex: /^[N-S]/i },
        { label: 'T-Z', regex: /^[T-Z]/i },
    ];

    const filteredMinerals = minerals.filter(item => {
        const activeRegex = ALPHABET_GROUPS.find(g => g.label === activeTab).regex;
        return activeRegex.test(item.name);
    });

    const handleGuess = () => {
        if (!selectedItem || gameState.complete) return;

        const isCorrect = selectedItem.name === targetItem.name;
        const newGuesses = [...currentGuesses, selectedItem.name];
        const hasLost = newGuesses.length >= maxGuesses && !isCorrect;

        updateGameState({
            ...gameState,
            guesses: newGuesses,
            win: gameState.win || isCorrect,
            complete: gameState.complete || isCorrect || hasLost
        });

        setSelectedItem(null);
        setShowPicker(false);

        if (!isMuted) {
            new Audio(isCorrect ? "/sounds/reward.mp3" : "/sounds/sell.mp3").play();
        }
    };

    // Replace this placeholder logic with your actual spritesheet math
    const spriteStyle = {
        backgroundImage: "url('/images/geology-spritesheet-placeholder.webp')",
        backgroundPosition: `0% 0%`,
        backgroundSize: '1000% 100%',
        imageRendering: 'pixelated',
    };

    return (
        <div className="flex flex-col items-center w-full h-full p-4 pl-32 relative">

            {/* --- IMAGE CLUE SECTION --- */}
            <div className="w-full max-w-md bg-[#fcedd2] border-4 border-[#d5a05a] rounded-xl p-6 mb-4 shadow-sm flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold text-main mb-4 text-center">What is this item?</h3>

                <div className="w-48 h-48 border-4 border-main rounded-lg overflow-hidden bg-black/5 flex items-center justify-center relative">
                    {/* The new dynamic sprite div */}
                    <div
                        className="transition-all duration-700 ease-out"
                        style={{
                            // Assuming your spritesheet is named "geology.png" or "minerals.png"
                            ...getSpriteStyle("geology", targetItem.index, 0),
                            transform: `scale(${currentStage.scale})`,
                            filter: `blur(${currentStage.blur}px)`,
                        }}
                    />
                </div>

                <p className="mt-4 text-main font-bold">
                    Guesses left: {maxGuesses - guessesMade}
                </p>
            </div>

            {/* --- ANSWER HISTORY SECTION --- */}
            <div className="w-full max-w-xl mb-4 flex flex-col gap-2">
                {currentGuesses.map((guess, idx) => {
                    const isCorrect = guess === targetItem.name;
                    return (
                        <div key={idx} className={`p-2 border-2 rounded text-center text-xl font-bold text-white
                            ${isCorrect ? "bg-green-600 border-green-800" : "bg-red-500 border-red-700"}`}>
                            {formatName(guess)}
                        </div>
                    );
                })}
            </div>

            {/* --- INPUT & SELECTION SECTION --- */}
            {!gameState.complete && (
                <div className="flex flex-col items-center w-full max-w-2xl relative">
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={() => setShowPicker(!showPicker)}
                            className="bg-[#ffdfa6] border-4 border-[#d5a05a] px-6 py-3 rounded-xl text-2xl font-bold text-main hover:bg-[#ffecc2] active:scale-95 transition-transform"
                        >
                            {selectedItem ? formatName(selectedItem.name) : "Select an Item..."}
                        </button>

                        <CustomButton
                            variant="submit"
                            label="Submit"
                            icon={"/images/submit-button.webp"}
                            onClick={handleGuess}
                            isMuted={isMuted}
                            className={!selectedItem ? "opacity-50 pointer-events-none" : ""}
                        />
                    </div>

                    {/* Alphabetical Word Bank Modal */}
                    {showPicker && (
                        <div className="absolute bottom-[120%] bg-[#fcedd2] border-4 border-[#d5a05a] rounded-xl w-full h-[380px] p-4 z-50 flex flex-col shadow-2xl">

                            {/* Alphabetical Tabs */}
                            <div className="flex justify-between gap-1 mb-4 pb-2 border-b-2 border-[#d5a05a] overflow-x-auto">
                                {ALPHABET_GROUPS.map(group => (
                                    <button
                                        key={group.label}
                                        onClick={() => setActiveTab(group.label)}
                                        className={`px-3 py-2 rounded-lg font-bold flex-1 whitespace-nowrap transition-colors
                                            ${activeTab === group.label ? "bg-main text-white" : "bg-[#ffdfa6] text-main hover:bg-[#ffecc2]"}`}
                                    >
                                        {group.label}
                                    </button>
                                ))}
                            </div>

                            {/* Scrollable Options for Active Tab */}
                            <div className="overflow-y-auto flex-1 p-2">
                                <div className="grid gap-2 grid-cols-3 sm:grid-cols-4">
                                    {filteredMinerals.map(item => (
                                        <button
                                            key={item.name}
                                            onClick={() => {
                                                setSelectedItem(item);
                                                setShowPicker(false);
                                            }}
                                            className={`p-2 border-2 rounded font-bold text-main hover:bg-[#ffecc2] transition-colors flex flex-col items-center
                                                ${selectedItem?.name === item.name ? "bg-[#ffecc2] border-main" : "bg-white border-[#d5a05a]"}`}
                                        >

                                            {/* THE NEW SPRITE DIV */}
                                            <div
                                                style={getSpriteStyle("geology", item.index, 0)}
                                                className="scale-75 mb-1"
                                            />

                                            <span className="text-xs text-center leading-tight">{formatName(item.name)}</span>
                                        </button>
                                    ))}

                                    {filteredMinerals.length === 0 && (
                                        <div className="col-span-full text-center text-main opacity-50 mt-4">
                                            No items found in this category.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Game Over Message */}
            {gameState.complete && (
                <div className="mt-4 text-3xl font-bold">
                    {gameState.win ? (
                        <span className="text-green-600">Perfect ID!</span>
                    ) : (
                        <span className="text-red-500">Out of guesses! It was {formatName(targetItem.name)}.</span>
                    )}
                </div>
            )}
        </div>
    );
}