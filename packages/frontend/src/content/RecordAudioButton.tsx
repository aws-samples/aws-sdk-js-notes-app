import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { MicFill, MicMute } from "react-bootstrap-icons";

import MicrophoneStream from "microphone-stream";

import { pcmEncode } from "../libs/audioUtils";
import { getStreamTranscriptionResponse } from "../libs/getStreamTranscriptionResponse";

const RecordAudioButton = (props: {
  disabled: boolean;
  isRecording: boolean;
  setIsRecording: Function;
  setNoteContent: Function;
}) => {
  const { disabled, isRecording, setIsRecording, setNoteContent } = props;
  const [micStream, setMicStream] = useState<MicrophoneStream | undefined>();
  const [errorMsg, setErrorMsg] = useState("");

  const toggleTrascription = async () => {
    if (isRecording) {
      setIsRecording(false);
      if (micStream) {
        micStream.stop();
        setMicStream(undefined);
      }
    } else {
      setIsRecording(true);
      let mic;
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
          setMicStream(undefined);
        }
        setIsRecording(false);
      }
    }
  };

  const streamAudioToWebSocket = async (micStream: MicrophoneStream) => {
    const pcmEncodeChunk = (audioChunk: Buffer) => {
      const raw = MicrophoneStream.toRaw(audioChunk);
      if (raw == null) return;
      return Buffer.from(pcmEncode(raw));
    };

    const transcribeInput = async function* () {
      // @ts-ignore Type 'MicrophoneStream' is not an array type or a string type.
      for await (const chunk of micStream) {
        yield { AudioEvent: { AudioChunk: pcmEncodeChunk(chunk) } };
      }
    };

    const { TranscriptResultStream } = await getStreamTranscriptionResponse(
      transcribeInput()
    );

    if (TranscriptResultStream) {
      let partialTranscription = "";
      for await (const event of TranscriptResultStream) {
        if (event.TranscriptEvent) {
          const { Results: results } = event.TranscriptEvent.Transcript || {};

          if (results && results.length > 0) {
            if (
              results[0]?.Alternatives &&
              results[0]?.Alternatives?.length > 0
            ) {
              const { Transcript } = results[0].Alternatives[0];

              const transcriptionToRemove = partialTranscription;
              // fix encoding for accented characters.
              const transcription = decodeURIComponent(
                escape(Transcript || "")
              );

              setNoteContent(
                (noteContent: any) =>
                  noteContent.replace(transcriptionToRemove, "") + transcription
              );

              // if this transcript segment is final, reset transcription
              if (!results[0].IsPartial) {
                partialTranscription = "";
              } else {
                partialTranscription = transcription;
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
        disabled={disabled}
      >
        {isRecording ? <MicFill /> : <MicMute />}
      </Button>
    </>
  );
};

export { RecordAudioButton };
