import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { IDENTITY_POOL_ID, REGION } from "../config.json";

const getSynthesizedSpeechResponse = (textToSynthesize: string) => {
  const client = new PollyClient({
    region: REGION,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: REGION }),
      identityPoolId: IDENTITY_POOL_ID,
    }),
  });

  return client.send(
    new SynthesizeSpeechCommand({
      OutputFormat: "pcm",
      Text: textToSynthesize,
      VoiceId: "Aditi",
    })
  );
};

export { getSynthesizedSpeechResponse };
