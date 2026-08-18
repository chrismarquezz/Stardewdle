import { useState, useMemo } from "react";
import { GameDataProvider, useGameData } from "../../context/GameDataContext";
import { formatName } from "../../utils/formatString";
import { scrollbarStyles } from "../../utils/scrollbarStyles";
import { getSpriteStyle } from "../../utils/spriteUtils";

import CustomButton from "../CustomButton";

export default function CookingGame({ gameState, updateGameState, isMobilePortrait, isMuted }) {
    const { cooking, dailyData } = useGameData();

    // Extract today's target food from the daily index
    const targetFoodIndex = dailyData?.dailyItems?.cooking;
    const targetFood = cooking?.foods?.[targetFoodIndex];

    const [selectedFood, setSelectedFood] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
    const [cols, setCols] = useState(4); // Toggle column count

    if (!targetFood) {
        console.log("NO FOOD");
        console.log("Cooking Array:", cooking);
        console.log("Target Index:", dailyData?.dailyItems?.cooking);
        return null;
    }

    // Dynamically build an alphabetical list of all unique ingredients
    const masterIngredientList = useMemo(() => {
        if (!cooking) return [];

        // Handle both flat arrays and dictionary wrappers just in case
        const foodsArray = Array.isArray(cooking) ? cooking : cooking.foods || [];

        const uniqueIngredients = new Set();
        foodsArray.forEach(food => {
            if (food.ingredients) {
                Object.keys(food.ingredients).forEach(ingName => uniqueIngredients.add(ingName));
            }
        });

        // Sort alphabetically to perfectly match your Row 1 spritesheet indices
        return Array.from(uniqueIngredients).sort((a, b) => a.localeCompare(b));
    }, [cooking]);

    const handleSubmit = () => {
        if (!selectedFood || gameState.complete) return;

        const isCorrect = selectedFood.name === targetFood.name;
        const newGuesses = [...gameState.guesses, selectedFood.name];

        // Frontend Validation Update
        updateGameState({
            ...gameState,
            guesses: newGuesses,
            win: gameState.win || isCorrect,
            complete: gameState.complete || isCorrect || newGuesses.length >= 9 // Assuming 6 max guesses
        });

        setSelectedFood(null);
        setShowPicker(false);
        if (!isMuted) new Audio(isCorrect ? "/sounds/reward.mp3" : "/sounds/sell.mp3").play();
    };
    return (
        <div
            className={`flex flex-row items-center h-full gap-4`}
        >
            <div className="flex flex-col justify-center items-center w-1/2 h-full p-4 relative gap-4">
                <div
                    className="relative bg-no-repeat bg-cover w-[240px] aspect-[60/41] bg-[url('/images/selected-frame.webp')]"
                >
                    <div
                        style={{
                            backgroundImage: `url('/images/minigames/bundleIcons/homeCook.webp')`,
                            imageRendering: 'pixelated',
                        }}
                        className="absolute top-[16px] left-1/2 -translate-x-1/2 bg-cover h-[128px] w-[128px] bg-no-repeat"
                    />
                </div>
                <div className="flex flex-col justify-center items-center bg-[url('/images/game/guesses.webp')] bg-no-repeat p-4 bg-contain bg-center aspect-[5/3]">
                    <h3 className="text-5xl text-[#BC6131] pb-4">Ingredients Needed:</h3>

                    <div className="flex gap-4 pb-8">
                        {Object.entries(targetFood.ingredients).map(([ingName, count]) => {
                            const ingredientIndex = masterIngredientList.indexOf(ingName);

                            return (
                                <div className="flex flex-col justify-center items-center gap-2 p-2">
                                    <div
                                        className={`w-16 h-16 p-1 flex items-center justify-center`}
                                        style={{
                                            backgroundImage: "url('/images/game/tile-bg.webp')",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            scale: isMobilePortrait ? "1.1" : "1",
                                        }}
                                    >
                                        <div
                                            style={getSpriteStyle("cooking", ingredientIndex, 0)}
                                            className="w-full h-full m-[2px] ml-[6px] mb-[6px] z-10"
                                        />
                                    </div>

                                    <div
                                        className="relative -bottom-1 px-3 py-1 flex items-center justify-center text-xl font-medium text-[#BC6131] text-center whitespace-nowrap"
                                        style={{
                                            backgroundImage: "url('/images/label.webp')",
                                            backgroundSize: "100% 100%",
                                            backgroundRepeat: "no-repeat",
                                            height: "28px",
                                        }}
                                    >
                                        {count}x {formatName(ingName)}
                                    </div>
                                </div>

                            )
                        })}
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
                <div className={`grid grid-cols-3 gap-2 items-center justify-center max-h-1/2`}>
                    {gameState.guesses.map((guess, idx) => {
                        const isCorrect = guess === targetFood.name;

                        const foodsArray = Array.isArray(cooking) ? cooking : cooking?.foods || [];

                        const guessedFoodObj = foodsArray.find(item => item.name === guess);
                        const spriteIndex = guessedFoodObj?.index ?? 0;
                        return (
                            <div
                                className="relative h-[72px] w-[72px] flex items-center justify-center"
                                style={{
                                    backgroundImage: "url('/images/game/boxSquare.webp')",
                                    backgroundSize: "100% 100%",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}
                            >
                                <div
                                    className={`w-[75%] h-[75%] absolute z-0 opacity-90 mix-blend-multiply ${isCorrect ? "bg-cyan-500" : "bg-red-700"}`}
                                />
                                <div className="group w-[63px] h-[63px] flex items-center justify-center">
                                    <div
                                        style={getSpriteStyle("cooking", spriteIndex, 1)}
                                        className="z-10 scale-[87.5%]"
                                        title={formatName(guess)}
                                    />
                                    <div
                                        className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 flex items-center justify-center text-xl font-medium text-[#BC6131] text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap"
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
                    <p className="text-5xl text-center text-[#BC6131] tracking-wide">
                        {gameState.complete
                            ? formatName(targetFood.name)
                            : selectedFood
                                ? formatName(selectedFood.name)
                                : "Select a Food..."
                        }
                    </p>
                </div>
                {gameState.complete ? (
                    <div className="text-3xl font-bold">
                        {gameState.win ? (
                            <span className="text-[#1E9365]">Bundle Completed!</span>
                        ) : (
                            <span className="text-[#BE2617]">Out of guesses!</span>
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
                                {selectedFood ?
                                    <div
                                        style={getSpriteStyle("cooking", selectedFood.index, 1)}
                                        className="z-10 scale-[87.5%] clickable"
                                        title={formatName(selectedFood.name)}
                                    />
                                    : <></>
                                }
                                <div className="absolute inset-0 bg-white/50 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-[12px]"
                                />

                            </button>

                            <CustomButton
                                variant="submit"
                                label="Submit"
                                icon={"/images/submit-button.webp"}
                                onClick={handleSubmit}
                                isMuted={isMuted}
                                className={!selectedFood ? "opacity-50 pointer-events-none" : ""}
                            />
                        </div>

                        {showPicker && (
                            <div className="absolute top-0 bg-[#fcedd2] border-4 border-[#d5a05a] rounded-xl w-full h-[350px] p-4 z-50 flex flex-col shadow-2xl">

                                <div className="flex justify-between mb-4 pb-2 border-b-2 border-[#d5a05a]">
                                    <button onClick={() => setViewMode(v => v === "grid" ? "list" : "grid")} className="bg-[#d5a05a] text-white px-3 py-1 rounded font-bold">
                                        Toggle {viewMode === "grid" ? "List" : "Grid"}
                                    </button>
                                    {viewMode === "grid" && (
                                        <div className="flex gap-2 items-center text-[#BC6131] font-bold">
                                            Cols:
                                            {[3, 4, 5].map(num => (
                                                <button key={num} onClick={() => setCols(num)} className={`px-2 py-1 rounded ${cols === num ? 'bg-[#BC6131] text-white' : 'bg-white/50'}`}>
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className={`overflow-y-auto flex-1 p-2 ${scrollbarStyles}`}>
                                    <div className={viewMode === "grid" ? `grid gap-2 grid-cols-${cols}` : "flex flex-col gap-2"}
                                        style={{ columns: viewMode === "grid" ? cols : 1 }}>
                                        {cooking?.foods?.map(food => (
                                            <button
                                                key={food.name}
                                                onClick={() => {
                                                    setSelectedFood(food);
                                                    setShowPicker(false);
                                                }}
                                                className={`p-2 border-2 rounded font-bold text-[#BC6131] hover:bg-[#ffecc2] transition-colors
                                            ${selectedFood?.name === food.name ? "bg-[#ffecc2] border-[#BC6131]" : "bg-white border-[#d5a05a]"}`}
                                            >
                                                {viewMode === "grid" ? (
                                                    <div className="flex flex-col items-center">
                                                        <div
                                                            style={getSpriteStyle("cooking", food.index, 1)}
                                                            className="scale-75 mb-1"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        <div style={getSpriteStyle("cooking", food.index, 1)} className="scale-50 -ml-2" />
                                                        <div className="text-left text-lg">{formatName(food.name)}</div>
                                                    </div>
                                                )}
                                                <div
                                                    className="absolute -top-5 left-1/2 -translate-x-1/2 px-3 py-1 flex items-center justify-center text-xl font-medium text-[#BC6131] text-center transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap"
                                                    style={{
                                                        backgroundImage: "url('/images/label.webp')",
                                                        backgroundSize: "100% 100%",
                                                        backgroundRepeat: "no-repeat",
                                                        height: "28px",
                                                    }}
                                                >
                                                    {formatName(food.name)}
                                                </div>
                                            </button>
                                        ))}
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