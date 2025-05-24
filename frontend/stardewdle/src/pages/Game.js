import GameBox from "../components/GameBox";
import { useNavigate } from "react-router-dom";

export default function Game() {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex justify-center items-center flex-col"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <div
        onClick={() => {
          new Audio("/sounds/mouseClick.mp3").play();
          navigate("/");
        }}
        className="relative w-[624px] cursor-pointer group transform transition-transform duration-200 hover:scale-105"
      >
        <img
          src="/images/stardewdleLogo.png"
          alt="Stardewdle Home"
          className="w-full transition-opacity duration-200 group-hover:opacity-0"
        />
        <img
          src="/images/stardewdleLogo.png"
          alt="Stardewdle Home Hover"
          className="absolute top-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      </div>
      <GameBox />
    </div>
  );
}
