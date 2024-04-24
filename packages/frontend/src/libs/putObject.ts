import { s3Client } from "./s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const putObject = async (file: File) => {
  const Key = `${Date.now()}-${file.name}`;
  await s3Client.send(
    new PutObjectCommand({
      Key,
      Body: file,
      Bucket: import.meta.env.VITE_FILES_BUCKET,
    })
  );
  return Key;
};

export { putObject };
