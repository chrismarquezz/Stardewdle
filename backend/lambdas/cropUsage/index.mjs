import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = "stardewdleCounts";

export const handler = async (event) => {
    let allItems = [];
    let lastEvaluatedKey = undefined;

    console.log(`Starting scan to fetch all items from '${tableName}'.`);

    try {
        do {
            const params = {
                TableName: tableName,
                ExclusiveStartKey: lastEvaluatedKey,
            };

            const command = new ScanCommand(params);
            const data = await docClient.send(command);

            if (data.Items) {
                allItems.push(...data.Items);
            }

            lastEvaluatedKey = data.LastEvaluatedKey;

        } while (lastEvaluatedKey);

        console.log(`Scan complete. Fetched ${allItems.length} items.`);

        const wordCounts = allItems.reduce((acc, item) => {
            acc[item.word] = item.occurrences;
            return acc;
        }, {});

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wordCounts),
        };

    } catch (error) {
        console.error("Error scanning DynamoDB table:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to scan table.", error: error.message }),
        };
    }
};