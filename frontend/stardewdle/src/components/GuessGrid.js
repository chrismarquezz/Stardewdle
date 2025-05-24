const ATTRIBUTE_KEYS = ["growth_time", "season", "base_price", "regrows", "type"];
const ATTRIBUTE_LABELS = ["Growth", "Season", "Price", "Regrow", "Type"];

const BOX_IMAGE_MAP = {
  growth_time: "boxSmall.png",
  season: "boxLarge.png",
  base_price: "boxSmall.png",
  regrows: "boxSquare.png",
  type: "boxSmall.png",
};

const W_STRETCH_MAP = {
  growth_time: "90",
  season: "90",
  base_price: "90",
  regrows: "75",
  type: "90",
};

function isFullMatch(crop, answer) {
  return ATTRIBUTE_KEYS.every((key) => {
    const guessVal = crop?.[key];
    const answerVal = answer?.[key];

    if (key === "season") {
      const g = Array.isArray(guessVal) ? guessVal : [];
      const a = Array.isArray(answerVal) ? answerVal : [];
      return g.length === a.length && g.every((s) => a.includes(s));
    }

    return guessVal === answerVal;
  });
}

function capitalize(value) {
  if (typeof value === "string") {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return value;
}

function getColor(key, guessValue, correctValue) {
  if (key === "season") {
    const guessed = Array.isArray(guessValue) ? guessValue : [];
    const correct = Array.isArray(correctValue) ? correctValue : [];

    const allMatch =
      guessed.length === correct.length &&
      guessed.every((s) => correct.includes(s));

    if (allMatch) return "green";

    const partialMatch = guessed.some((s) => correct.includes(s));
    return partialMatch ? "yellow" : "red";
  }

  return guessValue === correctValue ? "green" : "red";
}

export default function GuessGrid({ guesses, answer }) {
  const rows = Array.from({ length: 6 }).map((_, i) => {
    const guessEntry = guesses[i];
    const crop = guessEntry?.crop;
    const cropColor = guessEntry && isFullMatch(crop, answer)
      ? "green"
      : guessEntry
      ? "red"
      : "gray";

    return (
      <div className="grid gap-1 items-center w-full"
        style={{ gridTemplateColumns: '64px 106px 192px 106px 64px 150px' }}>

        {/* Crop image */}
        <div
          className="relative h-[60px] flex items-center justify-center"
          style={{
            backgroundImage: "url('/images/boxSquare.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Color overlay */}
          <div
            className={`w-[75%] h-[75%] absolute inset-0 m-auto z-0 rounded-sm opacity-50 mix-blend-multiply ${
              cropColor === "green"
                ? "bg-green-500"
                : cropColor === "red"
                ? "bg-red-500"
                : "bg-white"
            }`}
          />

          {/* Crop image */}
          {crop?.image_url && (
            <img
              src={crop.image_url}
              alt={crop.name}
              className="relative z-10 w-[40px] h-[40px] object-contain"
            />
          )}
        </div>

        {/* Attribute boxes */}
        {ATTRIBUTE_KEYS.map((key, j) => {
          const value = crop?.[key];
          const correctValue = answer?.[key];
          const color = guessEntry ? getColor(key, value, correctValue) : "white";

          return (
            <div
              key={j}
              className="relative h-full flex items-center justify-center text-2xl leading-none"
              style={{
                backgroundImage: `url('/images/${BOX_IMAGE_MAP[key] || "boxLarge.png"}')`,
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Color Overlay */}
              <div
                className={`w-[${W_STRETCH_MAP[key]}%] h-[75%] absolute inset-0 m-auto z-0 rounded-sm opacity-50 mix-blend-multiply ${color === "green"
                  ? "bg-green-500"
                  : color === "yellow"
                    ? "bg-yellow-400"
                    : color === "red"
                      ? "bg-red-500"
                      : "bg-white"
                  }`}
              />

              {/* Content */}
              <div className={`relative z-10 flex items-center justify-center ${color === "yellow" ? "text-black" : "text-white"}`}>
                {guessEntry
                  ? key === "season"
                    ? (
                      <div className="flex gap-1 items-center justify-center">
                        {(value == "all"
                          ? ["spring", "summer", "fall", "winter"]
                          : Array.isArray(value)
                            ? value.map((s) => s.toLowerCase())
                            : []
                        ).map((season) => (
                          <img
                            key={season}
                            src={`/images/${season}.png`}
                            alt={season}
                            className="h-6 w-9"
                          />
                        ))}
                      </div>
                    )
                    : typeof value === "boolean"
                      ? value ? "Yes" : "No"
                      : key === "base_price"
                        ? `${value}g`
                        : key === "growth_time"
                          ? `${value} days`
                          : capitalize(value ?? "")
                  : ""}
              </div>
            </div>

          );
        })}
      </div>
    );
  });

  return (
    <div className="space-y-[2px] mt-4 h-full w-full items-center justify-center">
      {/* Headers */}
      <div className="grid gap-1" style={{ gridTemplateColumns: '64px 106px 192px 106px 64px 150px' }}>

        <div className="text-center text-3xl text-[#BC6131] leading-none">Crop</div>
        {ATTRIBUTE_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-3xl text-[#BC6131] leading-none"
          >
            {label}
          </div>
        ))}
      </div>
      {rows}
    </div>
  );
}
