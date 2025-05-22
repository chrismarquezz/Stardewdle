import GameBox from "../components/GameBox";

export default function CropsDaily() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex justify-center items-center"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <GameBox />
    </div>
  );
}
