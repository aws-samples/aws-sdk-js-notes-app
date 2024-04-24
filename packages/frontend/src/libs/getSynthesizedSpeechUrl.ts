import { PollyClient } from "@aws-sdk/client-polly";
import { getSynthesizeSpeechUrl } from "@aws-sdk/polly-request-presigner";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";

const getSynthesizedSpeechUrl = (textToSynthesize: string) => {
  const client = new PollyClient({
    region: import.meta.env.VITE_REGION,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: import.meta.env.VITE_REGION }),
      identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
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
