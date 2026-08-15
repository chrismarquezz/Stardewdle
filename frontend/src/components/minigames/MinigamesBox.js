import { useState, useEffect } from "react";
import { useSound } from "../../context/SoundContext";
import { useGameData } from "../../context/GameDataContext";
import { getTimeUntilMidnightUTC } from "../../utils/dateUtils";
import { formatName } from "../../utils/formatString";

import CookingGame from "./CookingGame";
import FishingGame from "./FishingGame";
import QuotesGame from "./QuotesGame";
import GeologyGame from "./GeologyGame";

import CropLoader from "../CropLoader";
import CustomButton from "../CustomButton";
import HelpModal from "../game/HelpModal";
import UpdatesModal from "../UpdatesModal";
import BundleButton from "./BundleButton";

const staticGameData =
    [
        {
            name: "food",
            label: "Home Cook's",
            bundleNum: 1,
            imgPath: "homeCook",
            pos: "top-[25%] left-[50%]",
        },
        {
            name: "map",
            label: "Treasure Hunter's",
            bundleNum: 2,
            imgPath: "treasureHunter",
            pos: "top-[50%] left-[25%]",
        },
        {
            name: "npc",
            label: "Helper's",
            bundleNum: 3,
            imgPath: "helper",
            pos: "top-[50%] left-[75%]",
        },
        {
            name: "minerals",
            label: "Geologist's",
            bundleNum: 4,
            imgPath: "geologist",
            pos: "top-[75%] left-1/3",
        },
        {
            name: "fish",
            label: "Quality Fish",
            bundleNum: 5,
            imgPath: "qualityFish",
            pos: "top-[75%] left-2/3",
        }
    ];

export default function MinigamesBox({ isMobilePortrait }) {
    const {
        isReady,
        showUpdates,
        setShowUpdates,
        shouldPulse,
        handleOpenUpdates
    } = useGameData();

    const { isMuted, toggleMute } = useSound();

    const [showHelp, setShowHelp] = useState(false);
    const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnightUTC());

    const [selectedGame, setSelectedGame] = useState("");
    const [selectedGameData, setSelectedGameData] = useState(null);
    const [isGameSelected, setIsGameSelected] = useState(false);

    const todayStr = new Date().toISOString().split("T")[0];
    const isNewDay = localStorage.getItem("stardewdle-date") !== todayStr;

    const [gameData, setGameData] = useState(() => {
        const defaultGameData = {
            food: { complete: false, win: false, guesses: [] },
            map: { complete: true, win: false, guesses: [] },
            npc: { complete: false, win: false, guesses: [], hints: 0 },
            minerals: { complete: false, win: false, guesses: [], hints: 0 },
            fish: { complete: false, win: false, guesses: [] }
        };

        if (isNewDay) return defaultGameData;

        const saved = localStorage.getItem("stardewdle-game-data");
        return saved ? JSON.parse(saved) : defaultGameData;
    });

    const allBundlesComplete = ['food', 'map', 'npc', 'minerals', 'fish'].every(key => gameData[key]?.complete);

    const [globalCompletions, setGlobalCompletions] = useState(0);

    useEffect(() => {
        setSelectedGameData(staticGameData.find(item => item.name === selectedGame) || null);
        setIsGameSelected(selectedGame !== "");
    }, [selectedGame]);

    useEffect(() => {
        // Only fire if everything is complete AND we haven't already synced it today
        if (allBundlesComplete && !gameData.apiSynced) {

            const recordCompletion = async () => {
                try {
                    // You will need to create this endpoint in your backend!
                    const response = await fetch(import.meta.env.VITE_API_URL + "/bundle-complete", {
                        method: "POST"
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setGlobalCompletions(data.newTotal); // Assuming API returns the updated count

                        // Mark as synced so we don't spam the database
                        setGameData(prev => {
                            const updated = { ...prev, apiSynced: true };
                            localStorage.setItem("stardewdle-game-data", JSON.stringify(updated));
                            return updated;
                        });
                    }
                } catch (error) {
                    console.error("Failed to sync bundle completion:", error);
                }
            };

            recordCompletion();
        }
    }, [allBundlesComplete, gameData.apiSynced]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                console.log("Tab is visible again, reloading...");
                window.location.reload();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        const hasSeenHelpModal = localStorage.getItem("stardewdle-hasSeenHelpModal");
        if (!hasSeenHelpModal) {
            setShowHelp(true);
            localStorage.setItem("stardewdle-hasSeenHelpModal", "true");
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setTimeLeft(getTimeUntilMidnightUTC()), 1000);
        return () => clearInterval(interval);
    }, []);

    const updateGameState = (gameName, newState) => {
        setGameData(prev => {
            const updated = { ...prev, [gameName]: newState };
            localStorage.setItem("stardewdle-game-data", JSON.stringify(updated));
            return updated;
        });
    };

    const markAnimationSeen = (gameName) => {
        setGameData(prev => {
            const updated = {
                ...prev,
                [gameName]: { ...prev[gameName], animationSeen: true }
            };
            localStorage.setItem("stardewdle-game-data", JSON.stringify(updated));
            return updated;
        });
    };

    const renderMinigame = () => {
        switch (selectedGame) {
            case "food":
                return (
                    <CookingGame
                        gameState={gameData.food}
                        updateGameState={(newState) => updateGameState("food", newState)}
                        isMobilePortrait={isMobilePortrait}
                        isMuted={isMuted}
                    />
                );
            case "fish":
                return (
                    <FishingGame
                        gameState={gameData.fish}
                        updateGameState={(newState) => updateGameState("fish", newState)}
                        isMobilePortrait={isMobilePortrait}
                        isMuted={isMuted}
                    />
                );
            case "npc":
                return (
                    <QuotesGame
                        gameState={gameData.npc}
                        updateGameState={(newState) => updateGameState("npc", newState)}
                        isMobilePortrait={isMobilePortrait}
                        isMuted={isMuted}
                    />
                );
            case "minerals":
                return (
                    <GeologyGame
                        gameState={gameData.minerals}
                        updateGameState={(newState) => updateGameState("minerals", newState)}
                        isMobilePortrait={isMobilePortrait}
                        isMuted={isMuted}
                    />
                );
            default:
                return (
                    <div className="flex h-full w-full items-center justify-center text-4xl text-[#BC6131]">
                        Coming Soon!
                    </div>
                );
        }
    };

    if (!isReady) {
        return <CropLoader className={isMobilePortrait ? "content-counter-rotate-mobile" : ""} />;
    }

    return (
        <div
            className={`relative shadow-xl bg-no-repeat bg-center ${isMobilePortrait
                ? "gamebox-mobile-layout"
                : "mt-2"
                }`}
            style={{
                backgroundImage: isMobilePortrait
                    ? selectedGame === "map" ? "url('/images/minigames/mainBG2.webp')" : "url('/images/minigames/mainBG.webp')"
                    : selectedGame === "map" ? "url('/images/minigames/mainBG2.webp')" : "url('/images/minigames/mainBG.webp')",
                backgroundSize: "100% 100%",
                width: isMobilePortrait ? "1500px" : "1440px",
                height: isMobilePortrait ? "940px" : "810px",
            }}
        >
            <h2 className="w-full justify-center items-center text-[#BC6131] text-center text-2xl md:text-7xl font-semibold pt-2">
                {isGameSelected ? selectedGameData.label + " Bundle" : "Minigame Bundles"}
            </h2>


                {/* --- COMPLETION UI --- */}
                {allBundlesComplete && !isGameSelected && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 bg-[#ffdfa6] border-4 border-[#d5a05a] px-6 py-2 rounded-xl">
                        {/* Stardew Star / Junimo Icon */}
                        <div
                            className="w-12 h-12 bg-no-repeat bg-contain"
                            style={{ backgroundImage: "url('/images/stardrop.webp')" }}
                        />
                        <div className="flex flex-col text-left">
                            <span className="text-xl font-bold text-[#1E9365]">Community Center Restored!</span>
                            <span className="text-md text-[#BC6131] font-medium">
                                Total Restorations Today: {globalCompletions}
                            </span>
                        </div>
                    </div>
                )}

            {isGameSelected ?
                (
                    <div
                        className={`relative bg-no-repeat bg-center ${isMobilePortrait
                            ? "gamebox-mobile-layout"
                            : "mt-[16px] ml-[103px]"
                            }`}
                        style={{
                            backgroundImage: isMobilePortrait
                                ? "url('/images/minigames/innerBG.webp')"
                                : "url('/images/minigames/innerBG.webp')",
                            backgroundSize: "100% 100%",
                            width: isMobilePortrait ? "1500px" : "1233px",
                            height: isMobilePortrait ? "940px" : "603px",
                        }}
                    >
                        <div
                            className={`absolute flex top-2 left-2 `}
                        >
                            <CustomButton
                                variant="share"
                                icon="/images/minigames/arrowBack.webp"
                                label="Return"
                                isMuted={isMuted}
                                onClick={() => {
                                    setSelectedGame("");
                                }}
                                isMobilePortrait={isMobilePortrait}
                            />
                        </div>
                        

                        <div
                            className={`flex flex-row items-center h-full gap-4`}
                        >
                            <div
                                className="relative bg-no-repeat bg-contain flex justify-center items-center"
                                style={{
                                    backgroundImage: "url('/images/selected-frame.webp')",
                                    width: "240px",
                                    height: "164px",
                                }}
                            >
                                {isGameSelected && (
                                    <div
                                        style={{
                                            backgroundImage: `url('/images/minigames/bundleIcons/${selectedGameData.imgPath}.webp')`,
                                            imageRendering: 'pixelated',
                                        }}
                                        className="absolute h-[108px] w-[176px] bg-no-repeat bg-contain bg-center"
                                        title={selectedGameData.label+" Bundle"}
                                    />
                                )}
                            </div>
                            {renderMinigame()}
                            {/*<div className="flex flex-col items-center">
                                <div
                                    className="flex items-center justify-center bg-center bg-no-repeat bg-contain"
                                    style={{
                                        backgroundImage: "url('/images/name-banner.webp')",
                                        width: "416px",
                                        height: "76px",
                                    }}
                                >
                                    <p className="text-5xl text-center text-[#BC6131] tracking-wide">
                                        {isGameSelected ? selectedGameData.label+" Bundle" : ""}
                                    </p>
                                </div>
                                
                            </div>*/}
                        </div>


                    </div>
                ) : (
                    <div
                        className="flex flex-col gap-2 h-full w-full items-center justify-center"
                    >
                        {staticGameData.map((bundle) => (
                            <BundleButton
                                key={bundle.name}
                                variant={bundle.bundleNum}
                                label={bundle.label}
                                onClick={() => { setSelectedGame(bundle.name) }}
                                isMuted={isMuted}
                                positionClass={bundle.pos}
                                isAnimated={gameData[bundle.name].complete}
                            />
                        ))}
                    </div>
                )
            }

            <div
                className={`absolute flex gap-[5px] ${isMobilePortrait
                    ? " bottom-[100px] -right-[145px] content-counter-rotate-mobile"
                    : "-top-[55px] right-0"
                    } `}
            >
                <CustomButton
                    variant="icon"
                    icon={isMuted ? "/images/muted.webp" : "/images/unmuted.webp"}
                    label={isMuted ? "Unmute" : "Mute"}
                    isMuted={true}
                    onClick={() => {
                        if (isMuted) {
                            new Audio("/sounds/pluck.mp3").play();
                        }
                        toggleMute();
                    }}
                    showLabel={true}
                    isMobilePortrait={isMobilePortrait}
                />

                <CustomButton
                    variant="icon"
                    icon={"/images/question-mark.webp"}
                    label={"Help"}
                    isMuted={isMuted}
                    onClick={() => {
                        setShowHelp(true);
                    }}
                    showLabel={true}
                    isMobilePortrait={isMobilePortrait}
                    soundPath={"/sounds/modal.mp3"}
                />

                <CustomButton
                    variant="icon"
                    icon="/images/info.webp"
                    label="Updates"
                    isMuted={isMuted}
                    onClick={handleOpenUpdates}
                    shouldPulse={shouldPulse}
                    showLabel={true}
                    isMobilePortrait={isMobilePortrait}
                    soundPath={"/sounds/modal.mp3"}
                />
            </div>
            {showUpdates && (
                <UpdatesModal
                    isMuted={isMuted}
                    onClose={() => setShowUpdates(false)}
                />
            )}
            {showHelp && (
                <HelpModal isMuted={isMuted} onClose={() => setShowHelp(false)} />
            )}
        </div>
    );
}
