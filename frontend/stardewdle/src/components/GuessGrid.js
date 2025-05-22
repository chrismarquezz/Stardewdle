const ATTRIBUTE_KEYS = ["growth_time", "season", "base_price", "regrows", "type"];
const ATTRIBUTE_LABELS = ["Growth", "Season", "Price", "Regrow", "Type"];

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

    return (
      <div key={i} className="grid grid-cols-6 gap-2 items-center">
        {/* Crop image */}
        <div className="flex justify-center items-center h-14">
          {crop?.image_url ? (
            <img
              src={crop.image_url}
              alt={crop.name}
              className="w-10 h-10 object-contain"
            />
          ) : null}
        </div>

        {/* Attribute boxes */}
        {ATTRIBUTE_KEYS.map((key, j) => {
          const value = crop?.[key];
          const correctValue = answer?.[key];
          const color = guessEntry ? getColor(key, value, correctValue) : "gray";

          return (
            <div
              key={j}
              className={`h-14 rounded-md flex items-center justify-center text-sm font-bold text-white ${
                color === "green"
                  ? "bg-green-500"
                  : color === "yellow"
                  ? "bg-yellow-400 text-black"
                  : color === "red"
                  ? "bg-red-500"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              {guessEntry
                ? Array.isArray(value)
                  ? value.map(capitalize).join(", ")
                  : typeof value === "boolean"
                  ? value ? "Yes" : "No"
                  : key === "base_price"
                  ? `${value}g`
                  : key === "growth_time"
                  ? `${value} days`
                  : capitalize(value ?? "")
                : ""}
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <div className="space-y-2 mt-6">
      {/* Headers */}
      <div className="grid grid-cols-6 gap-2 mb-2">
        <div className="text-center text-sm font-semibold text-gray-700">Crop</div>
        {ATTRIBUTE_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-sm font-semibold text-gray-700"
          >
            {label}
          </div>
        ))}
      </div>
      {rows}
    </div>
  );
}
