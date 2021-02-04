import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { MicFill, MicMute } from "react-bootstrap-icons";

// @ts-ignore https://github.com/saebekassebil/microphone-stream/issues/39
import * as MicrophoneStream from "microphone-stream";

import { pcmEncode } from "../libs/audioUtils";
import { getStreamTranscriptionResponse } from "../libs/getStreamTranscriptionResponse";

const RecordAudioButton = (props: {
  isRecording: boolean;
  setIsRecording: Function;
  noteContent: string;
  setNoteContent: Function;
}) => {
  const { isRecording, setIsRecording, noteContent, setNoteContent } = props;
  const [micStream, setMicStream] = useState<any>();
  const [errorMsg, setErrorMsg] = useState("");

  const toggleTrascription = async () => {
    if (isRecording) {
      setIsRecording(false);
      if (micStream) {
        micStream.stop();
        setMicStream(null);
      }
    } else {
      setIsRecording(true);
      let mic: any;
      try {
        const audio = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        mic = new MicrophoneStream();
        mic.setStream(audio);
        setMicStream(mic);
        await streamAudioToWebSocket(mic);
      } catch (error) {
        console.log(error);
        setErrorMsg(`${error.toString()}`);
      } finally {
        if (mic) {
          mic.stop();
          setMicStream(null);
        }
        setIsRecording(false);
      }
    }
  };

  const streamAudioToWebSocket = async (micStream: any) => {
    const pcmEncodeChunk = (audioChunk: any) => {
      const raw = MicrophoneStream.toRaw(audioChunk);
      if (raw == null) return;
      return Buffer.from(pcmEncode(raw));
    };

    const transcribeInput = async function* () {
      for await (const chunk of micStream) {
        yield { AudioEvent: { AudioChunk: pcmEncodeChunk(chunk) } };
      }
    };

    const { TranscriptResultStream } = await getStreamTranscriptionResponse(
      transcribeInput()
    );

    if (TranscriptResultStream) {
      let transcription = "";
      for await (const event of TranscriptResultStream) {
        if (event.TranscriptEvent) {
          const { Results: results } = event.TranscriptEvent.Transcript || {};

          if (results && results.length > 0) {
            if (
              results[0]?.Alternatives &&
              results[0]?.Alternatives?.length > 0
            ) {
              const { Transcript } = results[0].Alternatives[0];

              const prevTranscription = transcription;
              // fix encoding for accented characters.
              transcription = decodeURIComponent(escape(Transcript || ""));

              setNoteContent(
                (noteContent: any) =>
                  noteContent.replace(prevTranscription, "") + transcription
              );

              // if this transcript segment is final, reset transcription
              if (!results[0].IsPartial) {
                transcription = "";
              }
            }
          }
        }
      }
    }
  };

  return (
    <>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <Button
        variant={isRecording ? "primary" : "outline-secondary"}
        size="sm"
        onClick={toggleTrascription}
      >
        {isRecording ? <MicFill /> : <MicMute />}
      </Button>
    </>
  );
};

export { RecordAudioButton };
