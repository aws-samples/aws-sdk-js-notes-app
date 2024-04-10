import crypto from "crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { success, failure } from "./libs/response";
import type { APIGatewayEvent } from "aws-lambda";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event: APIGatewayEvent) => {
  const data = JSON.parse(event.body || "{}");
  const params = {
    TableName: process.env.NOTES_TABLE_NAME || "",
    Item: {
      noteId: crypto.randomBytes(20).toString("hex"),
      content: data.content,
      createdAt: Date.now().toString(),
      ...(data.attachment && { attachment: data.attachment }),
    },
  };

  try {
    await client.send(new PutCommand(params));
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
};
