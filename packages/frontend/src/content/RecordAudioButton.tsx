import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { MicFill, MicMute } from "react-bootstrap-icons";

// @ts-ignore
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
  const [errorMsg, setErrorMsg] = useState("");

  const toggleTrascription = async () => {
    let micStream: any;
    if (isRecording) {
      setIsRecording(false);
      if (micStream) {
        micStream.stop();
      }
    } else {
      setIsRecording(true);
      try {
        const audio = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        micStream = new MicrophoneStream();
        micStream.setStream(audio);
        await streamAudioToWebSocket(micStream);
      } catch (error) {
        console.log(error);
        setErrorMsg(`${error.toString()}`);
      } finally {
        micStream.stop();
        setIsRecording(false);
      }
    }
  };

  const streamAudioToWebSocket = async (micStream: any) => {
    const handleEventStreamMessage = (messageJson: any) => {
      let results = messageJson.Transcript.Results;

      if (results.length > 0) {
        if (results[0].Alternatives.length > 0) {
          const { Transcript } = results[0].Alternatives[0];

          // fix encoding for accented characters.
          const decodedTranscript = decodeURIComponent(escape(Transcript));
          // update noteContent with the latest result.
          setNoteContent(noteContent + decodedTranscript + "\n");
        }
      }
    };

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
      for await (const event of TranscriptResultStream) {
        if (event.TranscriptEvent) {
          const message = event.TranscriptEvent;
          handleEventStreamMessage(message);
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
