import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load crops.json
const crops = JSON.parse(readFileSync(path.join(__dirname, "crops.json"), "utf8"));

export const handler = async (event) => {
  try {
    const guess = JSON.parse(event.body).guess?.toLowerCase();

    if (!guess) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing or invalid 'guess'." }),
      };
    }

    // Find the guessed crop and the answer crop
    const guessedCrop = crops.find(c => c.name === guess);
    const answerCrop = crops.find(c => c.name === "potato"); // Replace with dynamic word later

    if (!guessedCrop) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid crop name." }),
      };
    }

    if (!answerCrop) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Answer crop not found." }),
      };
    }

    // Utility: compare numbers
    const compareNumbers = (a, b) => {
      if (a === b) return "match";
      return a > b ? "higher" : "lower";
    };

    // Utility: compare seasons
    const compareSeasons = (a, b) => {
      if (JSON.stringify(a.sort()) === JSON.stringify(b.sort())) return "match";
      if (a.some(season => b.includes(season))) return "partial";
      return "mismatch";
    };

    const result = {
      type: guessedCrop.type === answerCrop.type ? "match" : "mismatch",
      regrows: guessedCrop.regrows === answerCrop.regrows ? "match" : "mismatch",
      season: compareSeasons(guessedCrop.season, answerCrop.season),
      growth_time: compareNumbers(guessedCrop.growth_time, answerCrop.growth_time),
      base_price: compareNumbers(guessedCrop.base_price, answerCrop.base_price)
    };

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ result }),
    };
  } catch (err) {
    console.error("Error processing guess:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
};
