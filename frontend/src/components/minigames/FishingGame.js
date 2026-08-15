import { useState } from "react";
import { useGameData } from "../../context/GameDataContext";
import { formatName } from "../../utils/formatString";
import { getSpriteStyle } from "../../utils/spriteUtils";

import CustomButton from "../CustomButton";

export default function FishingGame({ gameState, updateGameState, isMobilePortrait, isMuted }) {
    const { fish, dailyData } = useGameData();

    // Extract today's target fish
    const targetFishIndex = dailyData?.dailyItems?.fish;
    const targetFish = fish?.[targetFishIndex];

    const [selectedLetter, setSelectedLetter] = useState(null);

    if (!targetFish) return null;

    const targetName = targetFish.name.toLowerCase();
    const guessedLetters = gameState.guesses || [];

    // Calculate lives based on incorrect guesses
    const incorrectGuesses = guessedLetters.filter(char => !targetName.includes(char));
    const livesLost = incorrectGuesses.length;
    const maxLives = 5;
    const livesRemaining = maxLives - livesLost;

    const KEYBOARD = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];

    const handleSubmit = () => {
        if (!selectedLetter || gameState.complete || guessedLetters.includes(selectedLetter)) return;

        const newGuesses = [...guessedLetters, selectedLetter];
        const isCorrectGuess = targetName.includes(selectedLetter);

        // Check win/loss conditions
        const newLivesLost = isCorrectGuess ? livesLost : livesLost + 1;

        // Remove spaces to check if all actual letters are guessed
        const uniqueLettersInName = new Set(targetName.replace(/\s/g, '').split(''));
        const hasWon = [...uniqueLettersInName].every(char => newGuesses.includes(char));
        const hasLost = newLivesLost >= maxLives;

        updateGameState({
            ...gameState,
            guesses: newGuesses,
            win: gameState.win || hasWon,
            complete: gameState.complete || hasWon || hasLost
        });

        setSelectedLetter(null);

        if (!isMuted) {
            new Audio(isCorrectGuess ? "/sounds/pluck.mp3" : "/sounds/sell.mp3").play();
            if (hasWon) new Audio("/sounds/reward.mp3").play();
            if (hasLost) new Audio("/sounds/lose.mp3").play();
        }
    };

    return (
        <div className="flex flex-col items-center w-full h-full p-4 pl-32 relative">

            {/* --- LIVES & HINT SECTION --- */}
            <div className="w-full flex justify-between items-center mb-6 max-w-2xl">
                <div className="text-2xl font-bold text-[#BC6131] bg-[#fcedd2] border-4 border-[#d5a05a] rounded-xl px-4 py-2 shadow-sm">
                    Lives: <span className={livesRemaining <= 1 ? "text-red-500" : ""}>{livesRemaining} / {maxLives}</span>
                </div>

                <div className="flex items-center gap-4">
                    {gameState.hintUsed ? (
                        <div className="bg-[#ffdfa6] border-4 border-[#d5a05a] rounded-xl p-2 w-20 h-20 flex justify-center items-center overflow-hidden">

                            <div
                                style={{
                                    ...getSpriteStyle("fish", targetFish.index, 0),
                                    filter: gameState.win ? 'none' : 'brightness(0)'
                                }}
                                className="scale-125 transition-all duration-300"
                            />

                        </div>
                    ) : (
                        <button
                            onClick={() => updateGameState({ ...gameState, hintUsed: true })}
                            className="bg-[#d5a05a] text-white font-bold px-4 py-2 rounded-xl border-b-4 border-[#BC6131] active:translate-y-1 active:border-b-0"
                        >
                            Reveal Silhouette Hint
                        </button>
                    )}
                </div>
            </div>

            {/* --- HANGMAN WORD DISPLAY --- */}
            <div className="w-full max-w-2xl bg-[#fcedd2] border-4 border-[#d5a05a] rounded-xl p-8 mb-8 flex flex-wrap justify-center gap-x-4 gap-y-6 shadow-sm">
                {targetName.split('').map((char, index) => {
                    if (char === ' ') return <div key={index} className="w-8" />; // Space between words

                    const isRevealed = guessedLetters.includes(char) || gameState.complete;
                    const isMissed = gameState.complete && !gameState.win && !guessedLetters.includes(char);

                    return (
                        <div key={index} className="flex flex-col items-center justify-end w-10 h-12 border-b-4 border-[#BC6131]">
                            <span className={`text-4xl font-bold uppercase ${isMissed ? 'text-red-500' : 'text-[#BC6131]'}`}>
                                {isRevealed ? char : ''}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* --- KEYBOARD SECTION --- */}
            {!gameState.complete && (
                <div className="flex flex-col items-center gap-2 mb-6">
                    {KEYBOARD.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-2">
                            {row.map(key => {
                                const letter = key.toLowerCase();
                                const isGuessed = guessedLetters.includes(letter);
                                const isCorrect = isGuessed && targetName.includes(letter);
                                const isWrong = isGuessed && !targetName.includes(letter);
                                const isSelected = selectedLetter === letter;

                                let keyColors = "bg-[#ffdfa6] text-[#BC6131] border-[#d5a05a] hover:bg-[#ffecc2]";
                                if (isCorrect) keyColors = "bg-green-500 text-white border-green-700 opacity-80 cursor-default";
                                else if (isWrong) keyColors = "bg-gray-400 text-white border-gray-600 opacity-50 cursor-default";
                                else if (isSelected) keyColors = "bg-[#BC6131] text-white border-[#8c431e]";

                                return (
                                    <button
                                        key={key}
                                        disabled={isGuessed}
                                        onClick={() => setSelectedLetter(letter)}
                                        className={`w-10 h-12 sm:w-12 sm:h-14 rounded-lg border-b-4 text-xl sm:text-2xl font-bold transition-colors active:translate-y-1 active:border-b-0 ${keyColors}`}
                                    >
                                        {key}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}

            {/* --- SUBMISSION / GAME OVER MESSAGE --- */}
            {!gameState.complete ? (
                <CustomButton
                    variant="submit"
                    label="Submit"
                    icon={"/images/submit-button.webp"}
                    onClick={handleSubmit}
                    isMuted={isMuted}
                    className={!selectedLetter ? "opacity-50 pointer-events-none" : ""}
                />
            ) : (
                <div className="mt-2 text-4xl font-bold">
                    {gameState.win ? (
                        <span className="text-green-600">Great Catch!</span>
                    ) : (
                        <span className="text-red-500">It got away! The fish was {formatName(targetFish.name)}.</span>
                    )}
                </div>
            )}
        </div>
    );
}