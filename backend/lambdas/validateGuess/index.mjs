import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load crop data from JSON file
const cropURL = "https://stardewdle-data.s3.amazonaws.com/crops.json";
const response = await fetch(cropURL);
const crops = await response.json();

// Setup DynamoDB
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// Helper functions
const compareNumbers = (a, b) => {
  if (a === b) return "match";
  return a > b ? "higher" : "lower";
};

const compareSeasons = (a, b) => {
  const aSet = new Set(a);
  const bSet = new Set(b);
  const overlap = [...aSet].filter(season => bSet.has(season));
  if (overlap.length === a.length && a.length === b.length) return "match";
  if (overlap.length > 0) return "partial";
  return "mismatch";
};

// Lambda handler
export const handler = async (event) => {
  try {
    const guess = JSON.parse(event.body).guess?.toLowerCase();
    if (!guess) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing or invalid 'guess'." }),
      };
    }

    const guessedCrop = crops.find(c => c.name === guess);
    if (!guessedCrop) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid crop name." }),
      };
    }

    // Get today's word from DynamoDB
    const today = new Date().toISOString().split("T")[0];
    const { Item } = await ddb.send(new GetCommand({
      TableName: "daily_words",
      Key: { date: today }
    }));

    if (!Item || !Item.word) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No word found for today." }),
      };
    }

    const answerCrop = crops.find(c => c.name === Item.word);
    if (!answerCrop) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Answer crop not found in dataset." }),
      };
    }

    // Compare attributes
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
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
};
