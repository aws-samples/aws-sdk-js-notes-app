import crypto from "crypto";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { success, failure } from "./libs/response";

// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent } from "aws-lambda";
import { endpoint } from "./libs/endpoint";

export const handler = async (event: APIGatewayEvent) => {
  const data = JSON.parse(event.body || "{}");
  const params = {
    TableName: process.env.NOTES_TABLE_NAME || "",
    Item: marshall({
      noteId: crypto.randomBytes(20).toString("hex"),
      content: data.content,
      createdAt: Date.now().toString(),
      ...(data.attachment && { attachment: data.attachment }),
    }),
  };

  try {
    const client = new DynamoDBClient({endpoint});
    await client.send(new PutItemCommand(params));
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
};
