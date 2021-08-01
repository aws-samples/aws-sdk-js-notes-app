import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { MicFill, MicMute } from "react-bootstrap-icons";

import { pcmEncode } from "../libs/audioUtils";
import { getStreamTranscriptionResponse } from "../libs/getStreamTranscriptionResponse";

const RecordAudioButton = (props: {
  disabled: boolean;
  isRecording: boolean;
  setIsRecording: Function;
  setNoteContent: Function;
}) => {
  let mediaRecorder: MediaRecorder;
  const { disabled, isRecording, setIsRecording, setNoteContent } = props;
  const [errorMsg, setErrorMsg] = useState("");

  const toggleTrascription = async () => {
    if (isRecording) {
      setIsRecording(false);
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
    } else {
      setIsRecording(true);
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorder = new MediaRecorder(audioStream);
        await streamAudioToWebSocket(mediaRecorder);
      } catch (error) {
        console.log(error);
        setErrorMsg(`${error.toString()}`);
      } finally {
        if (mediaRecorder) {
          mediaRecorder.stop();
        }
        setIsRecording(false);
      }
    }
  };

  const streamAudioToWebSocket = async (mediaRecorder: MediaRecorder) => {
    const pcmEncodeChunk = (audioChunk: Blob) =>
      Buffer.from(pcmEncode(audioChunk));

    const transcribeInput = async function* () {
      while (true) {
        const chunk: Blob = await new Promise((resolve) => {
          const handler = (event: BlobEvent) => {
            mediaRecorder.removeEventListener("dataavailable", handler);
            resolve(event.data);
          };
          mediaRecorder.addEventListener("dataavailable", handler);
        });
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
