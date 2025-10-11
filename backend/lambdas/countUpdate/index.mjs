import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const analyticsTableName = "stardewdleCounts";

export const handler = async (event) => {
    console.log(`Processing ${event.Records.length} records from the stream.`);

    for (const record of event.Records) {
        if (record.eventName === 'INSERT') {
            try {
                const newImage = record.dynamodb.NewImage;

                const word = newImage.word.S;

                if (!word) {
                    console.warn("Skipping record with no word attribute:", record);
                    continue;
                }

                const params = {
                    TableName: analyticsTableName,
                    Key: { word: word },
                    UpdateExpression: "ADD #count :inc",
                    ExpressionAttributeNames: {
                        "#count": "occurrences",
                    },
                    ExpressionAttributeValues: {
                        ":inc": 1,
                    },
                };

                const command = new UpdateCommand(params);
                await docClient.send(command);
                console.log(`Successfully incremented count for word: "${word}"`);

            } catch (error) {
                console.error("Failed to process record:", JSON.stringify(record, null, 2));
                console.error("Error:", error);
            }
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Successfully processed records." }),
    };
};