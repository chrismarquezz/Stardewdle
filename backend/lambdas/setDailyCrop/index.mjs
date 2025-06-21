import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cropURL = "https://stardewdle-data.s3.amazonaws.com/crops.json";
const response = await fetch(cropURL);
const crops = await response.json();

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const sevenDaysAgoISO = sevenDaysAgo.toISOString().split("T")[0];

    const queryCommand = new QueryCommand({
      TableName: "daily_words",
      KeyConditionExpression: "#date >= :sevenDaysAgo",
      ExpressionAttributeNames: {
        "#date": "date",
      },
      ExpressionAttributeValues: {
        ":sevenDaysAgo": sevenDaysAgoISO,
      },
      ProjectionExpression: "word",
    });

    const { Items } = await ddb.send(queryCommand);
    const recentWords = new Set(Items.map((item) => item.word));

    const availableCrops = crops.filter(
      (crop) => !recentWords.has(crop.name)
    );

    if (availableCrops.length === 0) {
      console.warn("No new words available. All crops have been used recently.");
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "No new words available for the day.",
        }),
      };
    }

    const randomCrop =
      availableCrops[Math.floor(Math.random() * availableCrops.length)];
    const todayISO = today.toISOString().split("T")[0];

    const putCommand = new PutCommand({
      TableName: "daily_words",
      Item: {
        date: todayISO,
        word: randomCrop.name,
        correct_guesses: 0,
      },
    });

    await ddb.send(putCommand);

    console.log(`Set word for ${todayISO}: ${randomCrop.name}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Word of the day set.",
        word: randomCrop.name,
      }),
    };
  } catch (err) {
    console.error("Error setting daily crop:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to set daily crop." }),
    };
  }
};