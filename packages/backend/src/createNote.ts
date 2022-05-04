//import crypto from "crypto";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { success, failure } from "./libs/response";
//import { errorResponse } from "/opt/nodejs/lambda-utils";

// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent } from "aws-lambda";

export const handler = async (event: APIGatewayEvent) => {
  const crypto = require("crypto");
  //  const resp = errorResponse("a","b");
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
    let client;
    if (process.env.AWS_SAM_LOCAL == "false") {
      client = new DynamoDBClient({});
      console.log("here_001");
    } else {
      client = new DynamoDBClient({
        endpoint: `http://${process.env.LOCAL_IP}:8000`,
      });
      console.log("process.env.LOCAL_IP", process.env.LOCAL_IP);
      console.log("here_002");
    }
    await client.send(new PutItemCommand(params));
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
};
