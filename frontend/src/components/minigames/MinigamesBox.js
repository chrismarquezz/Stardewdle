import { useState, useEffect } from "react";
import { useSound } from "../../context/SoundContext";
import { formatName } from "../../utils/formatString";

import CropLoader from "../CropLoader";
import CustomButton from "../CustomButton";
import HelpModal from "../HelpModal";
import UpdatesModal from "../UpdatesModal";
import BundleButton from "./BundleButton";

const DAILY_RESET_ENABLED = true;
const MOST_RECENT_UPDATE = "2026-06-19T00:00:00Z";

function todaysDate() {
    const today = new Date(new Date().toUTCString());
    return `${today.getUTCMonth() + 1
        }/${today.getUTCDate()}/${today.getUTCFullYear()}`;
}

function getTimeUntilMidnightUTC() {
    const now = new Date();
    const utcNow = new Date(now.toUTCString());
    const utcMidnight = new Date(
        Date.UTC(
            utcNow.getUTCFullYear(),
            utcNow.getUTCMonth(),
            utcNow.getUTCDate() + 1,
            0,
            0,
            0
        )
    );
    const diff = utcMidnight - utcNow;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
}

export default function MinigamesBox({ isMobilePortrait }) {
    const [storedDate, setStoredDate] = useState(() => {
        const saved = localStorage.getItem("stardewdle-date");
        return saved ? saved : new Date().toISOString().split("T")[0];
    });
    /*const [crops, setCrops] = useState(() => {
        const saved = localStorage.getItem("stardewdle-crops");

        if (saved) {
            try {
                const parsedCrops = JSON.parse(saved);

                if (parsedCrops.length === 0) return [];

                const hasCropIndex = Object.hasOwn(parsedCrops[0], 'crop_index');

                if (!hasCropIndex || parsedCrops[22]["type"] !== "fruit") {
                    console.log("Outdated crop data, resetting crops");
                    localStorage.removeItem("stardewdle-crops");
                    return [];
                }

                return parsedCrops;
            } catch (e) {
                console.error("Error parsing saved crops:", e);
                return [];
            }
        }

        return [];
    });*/

    const [showHelp, setShowHelp] = useState(false);
    const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnightUTC());
    const [showUpdates, setShowUpdates] = useState(false);
    const [shouldPulse, setShouldPulse] = useState(false);

    const [selectedGame, setSelectedGame] = useState("map");
    const [selectedGameData, setSelectedGameData] = useState(null);
    const [isGameSelected, setIsGameSelected] = useState(false);
    
    useEffect(() => {
        setSelectedGameData(staticGameData.find(item => item.name === selectedGame) || null);
        setIsGameSelected(selectedGame !== "");
    }, [selectedGame]);

    const { isMuted, toggleMute } = useSound();

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

    const [gameData, setGameData] = useState(() => {
        const saved = localStorage.getItem("stardewdle-game-data");
        return saved
            ? JSON.parse(saved)
            : {
                food: {
                    complete: false,
                    win: false,
                    guesses: [],
                },
                map: {
                    complete: false,
                    win: false,
                    guesses: [],
                },
                npc: {
                    complete: false,
                    win: false,
                    guesses: [],
                    hints: 0,
                },
                minerals: {
                    complete: false,
                    win: false,
                    guesses: [],
                    hints: 0,
                },
                fish: {
                    complete: false,
                    win: false,
                    guesses: [],
                }
            };
    });

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        if (storedDate !== today) {
            console.log("Resetting game due to date change");
            resetStored();
            return;
        }
    }, [storedDate]);

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

    // MAKE BOTH GAME PAGES SHARE UPDATEMODAL STATE
    useEffect(() => {
        const lastSeen = localStorage.getItem("stardewdle-lastUpdateSeen");

        if (!lastSeen) {
            setShouldPulse(true);
        } else {
            const lastSeenDate = new Date(lastSeen);
            const mostRecentDate = new Date(MOST_RECENT_UPDATE);

            if (lastSeenDate < mostRecentDate) {
                setShouldPulse(true);
            }
        }
    }, []);

    useEffect(() => {
        const hasSeenHelpModal = localStorage.getItem(
            "stardewdle-hasSeenHelpModal"
        );
        if (!hasSeenHelpModal) {
            setShowHelp(true);
            localStorage.setItem("stardewdle-hasSeenHelpModal", "true");
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeUntilMidnightUTC());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!DAILY_RESET_ENABLED) return;

        localStorage.setItem("stardewdle-date", storedDate);
    }, [storedDate]);

    function resetStored(refresh = false) {
        setStoredDate(new Date().toISOString().split("T")[0]);
        if (refresh) {
            window.location.reload();
            console.log("Reloaded due to date change");
        }
    }

    useEffect(() => {
        if (!DAILY_RESET_ENABLED) return;

        const fetchNewCrop = async () => {
            try {
                /*if (crops.length === 0) {
                    const cropResponse = await fetch(
                        `${import.meta.env.VITE_BUCKET_URL}/data/crops.json`
                    );
                    if (!cropResponse.ok) {
                        throw new Error(`HTTP error! status: ${cropResponse.status}`);
                    }
                    const cropList = await cropResponse.json();
                    setCrops(cropList);
                }

                if (crops.length === 0) return;

                const response = await fetch(import.meta.env.VITE_API_URL + "/word");
                const data = await response.json();
                const word = data.word;
                const cropDate = data.correct_date;

                const cropData = crops.find(
                    (crop) => crop.name.toLowerCase() === word.toLowerCase()
                );

                if (cropData) {
                    const cropDataWithDate = { ...cropData, date: cropDate };
                    setCorrectCrop(cropDataWithDate);
                } else {
                    console.warn("Crop not found for word:", word);
                }*/
            } catch (error) {
                console.error("Failed to fetch crop data or word:", error);
            }
        };

        const today = new Date().toISOString().split("T")[0];

        if (
            storedDate !== today
        ) {
            if (
                storedDate !== today
            ) {
                resetStored();
            }
            fetchNewCrop();
        }
    }, [storedDate]);

    // SET TO FETCHED DATA
    if (!storedDate) {
        return (
            <CropLoader
                className={isMobilePortrait ? "content-counter-rotate-mobile" : ""}
            />
        );
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

            {isGameSelected ?
                (
                    <div
                        className={`relative bg-no-repeat bg-center ${isMobilePortrait
                            ? "gamebox-mobile-layout"
                            : "mt-[23px] ml-[103px]"
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
                        <CustomButton
                            variant="share"
                            icon="/images/minigames/arrowBack.webp"
                            label="Return"
                            isMuted={isMuted}
                            onClick={() => {
                                setSelectedGame("");
                            }}
                            isMobilePortrait={isMobilePortrait}
                            className="left-2 top-2"
                        />

                        <div
                            className={`flex flex-row items-center h-full ${isMobilePortrait ? "mr-6 mt-[96px]" : "mr-24 mt-[80px]"}  gap-4`}
                        >
                            <div
                                className="relative bg-no-repeat bg-contain"
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
                                        className="absolute top-4 left-14 h-32 w-32 bg-no-repeat bg-cover"
                                        title={selectedGameData.label+" Bundle"}
                                    />
                                )}
                            </div>
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
                                onClick={() => { setSelectedGame(bundle.name) }} //gameData[bundle.name].complete = true
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
                    onClick={() => {
                        setShowUpdates(true);

                        localStorage.setItem(
                            "stardewdle-lastUpdateSeen",
                            new Date().toISOString()
                        );
                        setShouldPulse(false);
                    }}
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
