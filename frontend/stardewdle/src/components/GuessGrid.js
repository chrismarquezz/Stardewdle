const ATTRIBUTE_KEYS = [
  "growth_time",
  "base_price",
  "regrows",
  "type",
  "season",
];
const ATTRIBUTE_LABELS = ["Growth", "Price", "Regrow", "Type", "Season"];

const BOX_IMAGE_MAP = {
  growth_time: "boxSmall.png", //106px
  season: "boxLarge.png", //192px
  base_price: "boxSmall.png", //106px
  regrows: "boxSquare.png", //64px
  type: "boxSmall.png", //150px
};

const W_STRETCH_MAP = {
  growth_time: "90",
  season: "90",
  base_price: "90",
  regrows: "75",
  type: "90",
};

const COL_DIST = "64px 106px 106px 64px 150px 192px";

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
    const SEASONS = new Set(["spring", "summer", "fall", "winter"]); // Use a Set for SEASONS for efficient lookups

    const normalizeToSet = (val) => {
      if (val === "all") return SEASONS; // Return the full SEASONS set
      if (Array.isArray(val)) {
        // If an array contains "all", normalize it to all seasons
        if (val.includes("all")) {
          return SEASONS;
        }
        return new Set(val); // Convert the input array to a Set
      }
      // If it's a single string (e.g., "spring"), return a Set with that string
      if (typeof val === 'string') return new Set([val]);
      return new Set(); // Fallback for unexpected types
    };

    const guessedSet = normalizeToSet(guessValue);
    const correctSet = normalizeToSet(correctValue);

    // Check for "match" (both sets are identical in terms of elements and size)
    const allMatch =
      guessedSet.size === correctSet.size &&
      [...guessedSet].every(season => correctSet.has(season));

    if (allMatch) {
      return "green";
    }

    // Check for "partial" (at least one common element)
    const partialMatch = [...guessedSet].some(season => correctSet.has(season));

    if (partialMatch) {
      return "yellow";
    }

    // No common elements
    return "red";
  }

  // Original logic for non-season keys (assumes direct equality check)
  return guessValue === correctValue ? "green" : "red";
}



function getArrow(key, guessValue, correctValue) {
  if (key === "base_price" || key === "growth_time") {
    return guessValue > correctValue
      ? "arrow4D"
      : guessValue < correctValue
      ? "arrow4U"
      : null;
  }

  return null;
}

export default function GuessGrid({ guesses, answer }) {
  const rows = Array.from({ length: 6 }).map((_, i) => {
    const guessEntry = guesses[i];
    const crop = guessEntry?.crop;
    const cropColor =
      guessEntry && isFullMatch(crop, answer)
        ? "green"
        : guessEntry
        ? "red"
        : "gray";

    return (
      <div
        className="grid gap-1 items-center w-full"
        style={{ gridTemplateColumns: COL_DIST }}
      >
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
            <div className="relative group w-[40px] h-[40px] flex items-center justify-center">
              <img
                src={crop.image_url}
                alt={crop.name}
                className="relative z-10 w-[40px] h-[40px] object-contain"
              />
              {/* Tooltip label */}
              <div
                className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 flex items-center justify-center text-xl font-medium text-[#BC6131] text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap"
                style={{
                  backgroundImage: "url('/images/label.png')",
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  height: "28px",
                }}
              >
                {crop.name
                  .replace(/_/g, " ")
                  .replace(
                    /\w\S*/g,
                    (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                  )}
              </div>
            </div>
          )}
        </div>

        {/* Attribute boxes */}
        {ATTRIBUTE_KEYS.map((key, j) => {
          const value = crop?.[key];
          const correctValue = answer?.[key];
          const color = guessEntry
            ? getColor(key, value, correctValue)
            : "white";
          const arrow = guessEntry
            ? getArrow(key, value, correctValue)
            : "null";

          return (
            <div
              key={j}
              className="relative h-full flex items-center justify-center text-2xl leading-none"
              style={{
                backgroundImage: `url('/images/${
                  BOX_IMAGE_MAP[key] || "boxLarge.png"
                }')`,
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Color Overlay */}
              <div
                className={`w-[${
                  W_STRETCH_MAP[key]
                }%] h-[75%] absolute inset-0 m-auto z-0 rounded-sm opacity-50 mix-blend-multiply ${
                  color === "green"
                    ? "bg-green-500"
                    : color === "yellow"
                    ? "bg-yellow-400"
                    : color === "red"
                    ? "bg-red-500"
                    : "bg-white"
                }`}
              />

              {/* Content */}
              <div
                className={`relative z-10 flex items-center justify-center ${
                  color === "yellow" ? "text-black" : "text-white"
                }`}
              >
                {guessEntry ? (
                  key === "season" ? (
                    <div className="flex gap-1 items-center justify-center">
                      {(value == "all"
                        ? ["spring", "summer", "fall", "winter"]
                        : Array.isArray(value)
                        ? value.map((s) => s.toLowerCase())
                        : []
                      ).map((season) => (
                        <div
                          key={season}
                          className="relative group flex items-center justify-center"
                        >
                          <img
                            src={`/images/${season}.png`}
                            alt={season}
                            className="h-6 w-9"
                          />
                          <div
                            className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 flex items-center justify-center text-xl font-medium text-[#BC6131] text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap"
                            style={{
                              backgroundImage: "url('/images/label.png')",
                              backgroundSize: "100% 100%",
                              backgroundRepeat: "no-repeat",
                              height: "28px",
                            }}
                          >
                            {season.charAt(0).toUpperCase() + season.slice(1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : typeof value === "boolean" ? (
                    value ? (
                      "Yes"
                    ) : (
                      "No"
                    )
                  ) : key === "base_price" ? (
                    <>
                      {value}g{" "}
                      {arrow ? (
                        <img
                          src={`/images/${arrow}.png`}
                          alt={arrow}
                          className="h-[6px] w-[10px] ml-1"
                        />
                      ) : (
                        ""
                      )}
                    </>
                  ) : key === "growth_time" ? (
                    <>
                      {value} days{" "}
                      {arrow ? (
                        <img
                          src={`/images/${arrow}.png`}
                          alt={arrow}
                          className="h-[6px] w-[10px] ml-1"
                        />
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    capitalize(value ?? "")
                  )
                ) : (
                  ""
                )}
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
      <div className="grid gap-1" style={{ gridTemplateColumns: COL_DIST }}>
        <div className="text-center text-3xl text-[#BC6131] leading-none">
          Crop
        </div>
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
