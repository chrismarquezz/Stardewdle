import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const today = new Date().toISOString().split("T")[0];
  console.log("Today's date:", today);

  const command = new GetCommand({
    TableName: "daily_words",
    Key: { date: today }
  });

  try {
    const data = await docClient.send(command);
    console.log("DynamoDB response:", data);

    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Word not found for today" }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ word: data.Item.word }),
    };
  } catch (err) {
    console.error("Error fetching word:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
