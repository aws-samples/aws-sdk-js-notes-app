import {
  AudioStream,
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
} from "@aws-sdk/client-transcribe-streaming";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { IDENTITY_POOL_ID, REGION } from "../config.json";

const getStreamTranscriptionResponse = (
  AudioStream: AsyncIterable<AudioStream>
) => {
  const client = new TranscribeStreamingClient({
    region: REGION,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: REGION }),
      identityPoolId: IDENTITY_POOL_ID,
    }),
  });

  return client.send(
    new StartStreamTranscriptionCommand({
      LanguageCode: "en-US",
      MediaSampleRateHertz: 44100,
      MediaEncoding: "pcm",
      AudioStream,
    })
  );
};

export { getStreamTranscriptionResponse };
