import { S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";

const s3Client = new S3Client({
  region: import.meta.env.VITE_REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: import.meta.env.VITE_REGION }),
    identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
  }),
});

export { s3Client };
