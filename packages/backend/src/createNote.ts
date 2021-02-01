import crypto from "crypto";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { success, failure } from "./libs/response";

// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent } from "aws-lambda";

export const handler = async (event: APIGatewayEvent) => {
  const data = JSON.parse(event.body || "{}");
  const params = {
    TableName: process.env.NOTES_TABLE_NAME || "",
    Item: {
      noteId: {
        S: crypto.randomBytes(20).toString("hex"),
      },
      content: {
        S: data.content,
      },
      createdAt: { N: Date.now().toString() },
    },
  };

  if (data.attachment) {
    // @ts-ignore: Property 'attachment' does not exist on type
    params.Item.attachment = {
      S: data.attachment,
    };
  }

  try {
    const client = new DynamoDBClient({});
    await client.send(new PutItemCommand(params));
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
};
