import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { success, failure } from "./libs/response";
import type { APIGatewayEvent } from "aws-lambda";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event: APIGatewayEvent) => {
  const params = {
    TableName: process.env.NOTES_TABLE_NAME || "",
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'noteId': path parameter
    Key: { noteId: event.pathParameters?.id },
  };

  try {
    const result = await client.send(new GetCommand(params));
    if (result.Item) {
      // Return the retrieved item
      return success(result.Item);
    } else {
      return failure({ status: false, error: "Item not found." });
    }
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
};
