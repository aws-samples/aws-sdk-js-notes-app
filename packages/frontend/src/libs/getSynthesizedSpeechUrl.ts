import { PollyClient } from "@aws-sdk/client-polly";
import { getSynthesizeSpeechUrl } from "@aws-sdk/polly-request-presigner";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { IDENTITY_POOL_ID, REGION } from "../config";

const getSynthesizedSpeechUrl = (textToSynthesize: string) => {
  const client = new PollyClient({
    region: REGION,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: REGION }),
      identityPoolId: IDENTITY_POOL_ID,
    }),
  });

  return getSynthesizeSpeechUrl({
    client,
    params: {
      OutputFormat: "mp3",
      Text: textToSynthesize,
      VoiceId: "Aditi",
    },
  });
};

export { getSynthesizedSpeechUrl };
