import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { success, failure } from "./libs/response";

export const handler = async () => {
  const params = {
    TableName: process.env.NOTES_TABLE_NAME || "",
  };

  try {
    const client = new DynamoDBClient({});
    const result = await client.send(new ScanCommand(params));
    // Return the matching list of items in response body
    return success(result.Items.map((Item) => unmarshall(Item)));
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
};
