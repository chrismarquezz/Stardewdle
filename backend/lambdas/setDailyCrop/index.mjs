import fetch from "node-fetch";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async () => {
  let crops = [];

  try {
    const cropsResponse = await fetch(process.env.CROPS_API_URL + "/crops");
    if (!cropsResponse.ok) {
      throw new Error(`Failed to fetch crops from Lambda: ${cropsResponse.statusText}`);
    }
    crops = await cropsResponse.json();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const sevenDaysAgoISO = sevenDaysAgo.toISOString().split("T")[0];

    const scanCommand = new ScanCommand({
      TableName: "daily_words",
      FilterExpression: "#date >= :sevenDaysAgo", 
      ExpressionAttributeNames: {
        "#date": "date",
      },
      ExpressionAttributeValues: {
        ":sevenDaysAgo": sevenDaysAgoISO,
      },
      ProjectionExpression: "word",
    });

    const { Items } = await ddb.send(scanCommand);
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

    const randomCrop = availableCrops[Math.floor(Math.random() * availableCrops.length)];
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