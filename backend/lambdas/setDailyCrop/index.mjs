import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load crop list
const cropURL = "https://stardewdle-data.s3.amazonaws.com/crops.json";
const response = await fetch(cropURL);
const crops = await response.json();

// Set up DynamoDB
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async () => {
  try {
    // Pick a random crop
    const randomCrop = crops[Math.floor(Math.random() * crops.length)];
    const today = new Date().toISOString().split("T")[0];

    // Store it in daily_words
    const command = new PutCommand({
      TableName: "daily_words",
      Item: {
        date: today,
        word: randomCrop.name
      }
    });

    await ddb.send(command);

    console.log(`✅ Set word for ${today}: ${randomCrop.name}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Word of the day set.", word: randomCrop.name })
    };
  } catch (err) {
    console.error("❌ Error setting daily crop:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to set daily crop." })
    };
  }
};
