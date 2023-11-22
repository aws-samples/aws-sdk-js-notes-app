import { s3Client } from "./s3Client";
import { FILES_BUCKET } from "../config";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const deleteObject = async (fileName: string) =>
  s3Client.send(
    new DeleteObjectCommand({
      Key: fileName,
      Bucket: FILES_BUCKET,
    })
  );

export { deleteObject };
