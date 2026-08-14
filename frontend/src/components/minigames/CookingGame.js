import { useState, useMemo } from "react";
import { useGameData } from "../../context/GameDataContext";
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
            complete: gameState.complete || isCorrect || newGuesses.length >= 6 // Assuming 6 max guesses
        });

        setSelectedFood(null);
        setShowPicker(false);
        if (!isMuted) new Audio(isCorrect ? "/sounds/reward.mp3" : "/sounds/sell.mp3").play();
    };
    return (
        <div className="flex flex-col items-center w-full h-full p-4 pl-32 relative">

            <div className="w-full bg-[#fcedd2] border-4 border-[#d5a05a] rounded-xl p-4 mb-4 flex flex-col items-center">
                <h3 className="text-2xl font-bold text-[#BC6131] mb-2">Ingredients Needed:</h3>

                <div className="flex gap-6">
                    {Object.entries(targetFood.ingredients).map(([ingName, count]) => {
                        // Find the index of this ingredient in our alphabetized list
                        const ingredientIndex = masterIngredientList.indexOf(ingName);

                        return (
                            <div key={ingName} className="flex flex-col items-center p-2 bg-[#ffdfa6] border-2 border-[#d5a05a] rounded">

                                {/* Pass the dynamically found index, and 1 for the ingredient row */}
                                <div
                                    style={getSpriteStyle("cooking", ingredientIndex, 0)}
                                    className="scale-100 mb-1"
                                />

                                <span className="font-bold text-[#BC6131]">{count}x {formatName(ingName)}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* --- ANSWER HISTORY SECTION --- */}
            <div className="w-full max-w-xl mb-4 flex flex-col gap-2">
                {gameState.guesses.map((guess, idx) => {
                    const isCorrect = guess === targetFood.name;
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
                            {selectedFood ? formatName(selectedFood.name) : "Select a Food..."}
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

                    {/* Word Bank / Picker Modal */}
                    {showPicker && (
                        <div className="absolute top-[120%] bg-[#fcedd2] border-4 border-[#d5a05a] rounded-xl w-full h-[350px] p-4 z-50 flex flex-col shadow-2xl">

                            {/* Picker Controls */}
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

                            {/* Scrollable Options */}
                            <div className={`overflow-y-auto flex-1 p-2 ${scrollbarStyles}`}>
                                <div className={viewMode === "grid" ? `grid gap-2 grid-cols-${cols}` : "flex flex-col gap-2"}>
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
                        <span className="text-green-600">Perfect Recipe!</span>
                    ) : (
                        <span className="text-red-500">Out of guesses! The food was {formatName(targetFood.name)}.</span>
                    )}
                </div>
            )}
        </div>
    );
}