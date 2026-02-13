import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    UpdateCommand,
    GetCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const analyticsTableName = "stardewdleCounts";
const wordsTableName = "daily_words";

export const handler = async (event) => {
    for (const record of event.Records) {
        if (record.eventName === 'INSERT') {
            try {
                const newImage = record.dynamodb.NewImage;
                const word = newImage.word.S;
                const todayDateStr = newImage.date.S;

                if (!word || !todayDateStr) continue;

                const todayDate = new Date(todayDateStr);
                const yesterdayDate = new Date(todayDate);
                yesterdayDate.setDate(todayDate.getDate() - 1);
                const yesterdayISO = yesterdayDate.toISOString().split("T")[0];

                const getYesterday = new GetCommand({
                    TableName: wordsTableName,
                    Key: { date: yesterdayISO },
                });

                const { Item: yesterdayItem } = await docClient.send(getYesterday);
                const yesterdayPlays = yesterdayItem?.totalAttempts || 0;

                const updateParams = {
                    TableName: analyticsTableName,
                    Key: { word: "total_plays" },
                    UpdateExpression: "ADD #plays :val",
                    ExpressionAttributeNames: { "#plays": "occurrences" },
                    ExpressionAttributeValues: { ":val": yesterdayPlays },
                };

                const cropParams = {
                    TableName: analyticsTableName,
                    Key: { word: word },
                    UpdateExpression: "ADD #count :inc",
                    ExpressionAttributeNames: { "#count": "occurrences" },
                    ExpressionAttributeValues: { ":inc": 1 },
                };

                await Promise.all([
                    docClient.send(new UpdateCommand(updateParams)),
                    docClient.send(new UpdateCommand(cropParams))
                ]);

                console.log(`Updated stats for ${word} and added ${yesterdayPlays} plays from ${yesterdayISO}`);

            } catch (error) {
                console.error("Error processing record:", error);
            }
        }
    }
    return { statusCode: 200 };
};