import { s3Client } from "./s3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const deleteObject = async (fileName: string) =>
  s3Client.send(
    new DeleteObjectCommand({
      Key: fileName,
      Bucket: import.meta.env.VITE_FILES_BUCKET,
    })
  );

export { deleteObject };
