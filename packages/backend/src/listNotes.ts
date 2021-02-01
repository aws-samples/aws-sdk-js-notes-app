import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { success, failure } from "./libs/response";

export const handler = async () => {
  const params = {
    TableName: process.env.NOTES_TABLE_NAME || "",
  };

  try {
    const client = new DynamoDBClient({});
    const result = await client.send(new ScanCommand(params));
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
};
