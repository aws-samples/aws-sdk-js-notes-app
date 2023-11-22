import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { success, failure } from "./libs/response";

// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent } from "aws-lambda";
import { endpoint } from "./libs/endpoint";

export const handler = async (event: APIGatewayEvent) => {
  const params = {
    TableName: process.env.NOTES_TABLE_NAME || "",
    // 'Key' defines the partition key and sort key of the item to be removed
    // - 'noteId': path parameter
    Key: marshall({ noteId: event.pathParameters?.id }),
  };

  try {
    const client = new DynamoDBClient({endpoint});
    await client.send(new DeleteItemCommand(params));
    return success({ status: true });
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
};
