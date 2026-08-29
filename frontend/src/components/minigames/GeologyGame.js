import { useState } from "react";
import { useGameData } from "../../context/GameDataContext";
import { formatName } from "../../utils/formatString";
import { getSpriteStyle } from "../../utils/spriteUtils";
import { scrollbarStyles } from "../../utils/scrollbarStyles";

import SpritePixelator from "./SpritePixelator";
import CustomButton from "../CustomButton";

export default function GeologyGame({ gameState, updateGameState, isMobilePortrait, isMuted }) {
    const { minerals, dailyData } = useGameData();

    const targetItemIndex = dailyData?.dailyItems?.geology;
    const targetItem = minerals?.[targetItemIndex];

    const [selectedItem, setSelectedItem] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [activeTab, setActiveTab] = useState('A-D');

    if (!targetItem) return null;

    const currentGuesses = gameState.guesses || [];
    const maxGuesses = 6;

    const guessesMade = currentGuesses.length;
    const isRevealed = gameState.complete;

    const getPixelLevel = () => {
        if (gameState.complete) return 1;

        switch (guessesMade) {
            case 0: return 24;
            case 1: return 12;
            case 2: return 8;
            case 3: return 6;
            case 4: return 4;
            case 5: return 2;
            default: return 1;
        }
    };

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

    const handleSubmit = () => {
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

    return (
        <div className={`flex flex-row items-center h-full gap-4`}>
            <div className="flex flex-col justify-center items-center w-1/2 h-full p-4 relative gap-4">
                <div className="relative bg-no-repeat bg-cover w-[240px] aspect-[60/41] bg-[url('/images/selected-frame.webp')]">
                    <div
                        style={{
                            backgroundImage: `url('/images/minigames/bundleIcons/geologist.webp')`,
                            imageRendering: 'pixelated',
                        }}
                        className="absolute top-[16px] left-1/2 -translate-x-1/2 bg-cover h-[128px] w-[128px] bg-no-repeat"
                    />
                </div>
                <div className="flex flex-col justify-center items-center bg-[url('/images/game/guesses.webp')] bg-no-repeat p-4 bg-contain bg-center aspect-[5/3]">
                    <h3 className="text-5xl text-main pb-2">What is this item?</h3>
                    <div className="relative h-[192px] w-[192px] flex items-center justify-center mb-4"
                        style={{
                            backgroundImage: "url('/images/minigames/boxMedium.webp')",
                            backgroundSize: "100% 100%",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}>
                        <SpritePixelator
                            sheetName="geology"
                            colIndex={targetItem.index}
                            pixelBlockLevel={getPixelLevel()}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center w-1/2 h-full p-4 relative gap-4"
                style={{
                    backgroundImage: "url('/images/game/cropgrid-bg.webp')",
                    backgroundSize: "90% 90%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}>
                <div className={`flex flex-wrap gap-2 items-center justify-center max-h-[50%] max-w-[75%] overflow-y-auto overflow-x-hidden ${scrollbarStyles} pb-8 px-8`}>
                    {currentGuesses.map((guess, idx) => {
                        const isCorrect = guess === targetItem.name;

                        const itemArray = Array.isArray(minerals) ? minerals : minerals || [];

                        const guessedObj = itemArray.find(item => item.name === guess);
                        const spriteIndex = guessedObj?.index ?? 0;
                        return (
                            <div
                                className="relative h-[108px] w-[108px] flex items-center justify-center"
                                style={{
                                    backgroundImage: "url('/images/game/boxSquare.webp')",
                                    backgroundSize: "100% 100%",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}
                                key={idx}
                            >
                                <div
                                    className={`w-[75%] h-[75%] absolute z-0 opacity-90 mix-blend-multiply ${isCorrect ? "bg-cyan-500" : "bg-red-700"}`}
                                />
                                <div className="group w-[108px] h-[108px] flex items-center justify-center">
                                    <div
                                        style={getSpriteStyle("geology", spriteIndex)}
                                        className="z-10 scale-[150%]"
                                    />
                                    <div
                                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 flex items-center justify-center text-xl font-medium text-main text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap"
                                        style={{
                                            backgroundImage: "url('/images/label.webp')",
                                            backgroundSize: "100% 100%",
                                            backgroundRepeat: "no-repeat",
                                            height: "28px",
                                        }}
                                    >
                                        {formatName(guess)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div
                    className="flex items-center justify-center bg-center bg-no-repeat bg-contain"
                    style={{
                        backgroundImage: "url('/images/name-banner.webp')",
                        width: "416px",
                        height: "76px",
                    }}
                >
                    <p className="text-5xl text-center text-main tracking-wide">
                        {gameState.complete
                            ? formatName(targetItem.name)
                            : selectedItem
                                ? formatName(selectedItem.name)
                                : "Select an Item..."
                        }
                    </p>
                </div>

                {gameState.complete ? (
                    <div className="text-3xl font-bold">
                        {gameState.win ? (
                            <span className="text-correct">Bundle Completed!</span>
                        ) : (
                            <span className="text-wrong">Out of guesses!</span>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={() => setShowPicker(!showPicker)}
                                className="group relative h-[72px] w-[72px] flex items-center justify-center clickable"
                                style={{
                                    backgroundImage: "url('/images/game/boxSquare.webp')",
                                    backgroundSize: "100% 100%",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}
                            >
                                <img src="images/minigames/search.webp" className="scale-[2.5]" />
                                <div className="absolute inset-0 bg-white/50 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-[12px]" />
                            </button>

                            <CustomButton
                                variant="submit"
                                label="Submit"
                                icon={"/images/submit-button.webp"}
                                onClick={handleSubmit}
                                isMuted={isMuted}
                                className={!selectedItem ? "opacity-50 pointer-events-none" : ""}
                            />
                        </div>

                        {showPicker && (
                            <div className="absolute top-0 bg-[#fcedd2] border-4 border-[#d5a05a] rounded-xl w-full h-full p-4 z-50 flex flex-col shadow-2xl">

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
                    </>
                )}
            </div>
        </div>
    );
}