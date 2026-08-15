import { useState } from "react";
import { useGameData } from "../../context/GameDataContext";
import { formatName } from "../../utils/formatString";
import { getSpriteStyle } from "../../utils/spriteUtils";

import CustomButton from "../CustomButton";

export default function QuotesGame({ gameState, updateGameState, isMobilePortrait, isMuted }) {
    const { quotes, dailyData } = useGameData();

    // Extract today's target villager and their 5 daily quotes
    const targetVillagerIndex = dailyData?.dailyItems?.villager?.index;
    const targetVillager = quotes?.[targetVillagerIndex];
    const quoteIndices = dailyData?.dailyItems?.villager?.quotes || [];

    const [selectedVillager, setSelectedVillager] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
    const [cols, setCols] = useState(4); // Toggle column count

    if (!targetVillager) return null;

    // Retrieve the actual text for the 5 selected quotes
    const dailyQuotes = quoteIndices.map(qIdx => {
        const qObj = targetVillager.quotes.find(q => q.index === qIdx);
        return qObj ? qObj.quote : "???";
    });

    const maxGuesses = 5;
    const currentGuesses = gameState.guesses || [];

    // 1st quote is free. Each wrong guess unlocks the next quote.
    const revealedCount = Math.min(currentGuesses.length + 1, maxGuesses);

    const handleGuess = (isSkip = false) => {
        if (gameState.complete) return;
        if (!isSkip && !selectedVillager) return;

        const guessName = isSkip ? "Skipped" : selectedVillager.name;
        const isCorrect = !isSkip && guessName === targetVillager.name;
        const newGuesses = [...currentGuesses, guessName];

        const hasLost = newGuesses.length >= maxGuesses && !isCorrect;

        updateGameState({
            ...gameState,
            guesses: newGuesses,
            win: gameState.win || isCorrect,
            complete: gameState.complete || isCorrect || hasLost
        });

        setSelectedVillager(null);
        setShowPicker(false);

        if (!isMuted) {
            new Audio(isCorrect ? "/sounds/reward.mp3" : "/sounds/sell.mp3").play();
        }
    };

    return (
        <div className="flex flex-col items-center w-full h-full p-4 pl-32 relative">

            {/* --- CLUES SECTION --- */}
            <div className="w-full max-w-2xl bg-[#fcedd2] border-4 border-[#d5a05a] rounded-xl p-4 mb-4 flex flex-col gap-2 shadow-sm">
                <h3 className="text-2xl font-bold text-[#BC6131] mb-2 text-center">Who said this?</h3>

                {dailyQuotes.map((quoteText, idx) => {
                    const isRevealed = idx < revealedCount || gameState.complete;
                    return (
                        <div key={idx} className={`p-3 border-2 rounded ${isRevealed ? 'bg-[#ffdfa6] border-[#d5a05a]' : 'bg-[#e5cfa8] border-[#c4a97e] opacity-60'}`}>
                            {isRevealed ? (
                                <p className="text-[#BC6131] font-bold italic text-lg">"{quoteText}"</p>
                            ) : (
                                <p className="text-[#a88a5e] font-bold text-center">Locked (Incorrect guess to reveal)</p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* --- ANSWER HISTORY SECTION --- */}
            <div className="w-full max-w-xl mb-4 flex flex-col gap-2">
                {currentGuesses.map((guess, idx) => {
                    const isCorrect = guess === targetVillager.name;
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
                            className="bg-[#ffdfa6] border-4 border-[#d5a05a] px-6 py-3 rounded-xl text-2xl font-bold text-[#BC6131] hover:bg-[#ffecc2] active:scale-95 transition-transform"
                        >
                            {selectedVillager ? formatName(selectedVillager.name) : "Select a Villager..."}
                        </button>

                        <CustomButton
                            variant="submit"
                            label="Submit"
                            icon={"/images/submit-button.webp"}
                            onClick={() => handleGuess(false)}
                            isMuted={isMuted}
                            className={!selectedVillager ? "opacity-50 pointer-events-none" : ""}
                        />

                        {/* Skip Button */}
                        <button
                            onClick={() => handleGuess(true)}
                            className="bg-gray-400 border-4 border-gray-500 px-4 py-3 rounded-xl text-xl font-bold text-white hover:bg-gray-500 active:scale-95 transition-transform"
                        >
                            Skip
                        </button>
                    </div>

                    {/* Word Bank / Picker Modal */}
                    {showPicker && (
                        // Placed to open upwards (bottom-[120%]) to avoid colliding with the bottom of the screen
                        <div className="absolute bottom-[120%] bg-[#fcedd2] border-4 border-[#d5a05a] rounded-xl w-full h-[350px] p-4 z-50 flex flex-col shadow-2xl">

                            {/* Picker Controls */}
                            <div className="flex justify-between mb-4 pb-2 border-b-2 border-[#d5a05a]">
                                <button onClick={() => setViewMode(v => v === "grid" ? "list" : "grid")} className="bg-[#d5a05a] text-white px-3 py-1 rounded font-bold hover:bg-[#c98a42]">
                                    Toggle {viewMode === "grid" ? "List" : "Grid"}
                                </button>
                                {viewMode === "grid" && (
                                    <div className="flex gap-2 items-center text-[#BC6131] font-bold">
                                        Cols:
                                        {[3, 4, 5, 6].map(num => (
                                            <button key={num} onClick={() => setCols(num)} className={`px-2 py-1 rounded ${cols === num ? 'bg-[#BC6131] text-white' : 'bg-white/50 hover:bg-white/80'}`}>
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Scrollable Options */}
                            <div className="overflow-y-auto flex-1 p-2">
                                <div className={viewMode === "grid" ? `grid gap-2 grid-cols-${cols}` : "flex flex-col gap-2"}>
                                    {quotes.map(villager => (
                                        <button
                                            key={villager.name}
                                            onClick={() => {
                                                setSelectedVillager(villager);
                                                setShowPicker(false);
                                            }}
                                            className={`p-2 border-2 rounded font-bold text-[#BC6131] hover:bg-[#ffecc2] transition-colors
                                                ${selectedVillager?.name === villager.name ? "bg-[#ffecc2] border-[#BC6131]" : "bg-white border-[#d5a05a]"}`}
                                        >
                                            {viewMode === "grid" ? (
                                                <div className="flex flex-col items-center">

                                                    {/* THE NEW SPRITE DIV */}
                                                    <div
                                                        // Assuming your spritesheet is named "villagers.png"
                                                        style={getSpriteStyle("villagers", villager.index, 0, 128)}
                                                        className="scale-75 mb-1"
                                                    />

                                                    <span className="text-sm">{formatName(villager.name)}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    {/* Optional list-view sprite */}
                                                        <div style={getSpriteStyle("villagers", villager.index, 0, 128)} className="scale-50 -ml-2" />
                                                    <div className="text-left text-lg">{formatName(villager.name)}</div>
                                                </div>
                                            )}
                                        </button>
                                    ))}
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
                        <span className="text-green-600">You guessed it!</span>
                    ) : (
                        <span className="text-red-500">Out of guesses! The villager was {formatName(targetVillager.name)}.</span>
                    )}
                </div>
            )}
        </div>
    );
}