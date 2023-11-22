import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { success, failure } from "./libs/response";

// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent } from "aws-lambda";
import { endpoint } from "./libs/endpoint";

export const handler = async (event: APIGatewayEvent) => {
  const params = {
    TableName: process.env.NOTES_TABLE_NAME || "",
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'noteId': path parameter
    Key: marshall({ noteId: event.pathParameters?.id }),
  };

  try {
    const client = new DynamoDBClient({endpoint});
    const result = await client.send(new GetItemCommand(params));
    if (result.Item) {
      // Return the retrieved item
      return success(unmarshall(result.Item));
    } else {
      return failure({ status: false, error: "Item not found." });
    }
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
};
