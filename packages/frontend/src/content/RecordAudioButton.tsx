import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { MicFill, MicMute } from "react-bootstrap-icons";

import { pcmEncode } from "../libs/audioUtils";
import { getStreamTranscriptionResponse } from "../libs/getStreamTranscriptionResponse";
import { pEventIterator } from "p-event";

type MessageDataType = {
  message: string;
  buffer: Array<Float32Array>;
  recordingLength: number;
};

const RecordAudioButton = (props: {
  disabled: boolean;
  isRecording: boolean;
  setIsRecording: Function;
  setNoteContent: Function;
}) => {
  const { disabled, isRecording, setIsRecording, setNoteContent } = props;

  let audioContext: AudioContext;
  let mediaRecorder: AudioWorkletNode;
  let mediaStream: MediaStream;
  let mediaStreamSource: MediaStreamAudioSourceNode;

  const [errorMsg, setErrorMsg] = useState("");

  const startRecording = async () => {
    setIsRecording(true);
    try {
      if (!audioContext) {
        audioContext = new window.AudioContext();
        await audioContext.audioWorklet.addModule("/worklets/recording-processor.js");
      }

      if (!mediaStream) {
        const constraints = { audio: true, video: false };
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      }

      if (!mediaStreamSource) {
        mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);
      }

      if (!mediaRecorder) {
        mediaRecorder = new AudioWorkletNode(audioContext, "recording-processor", {
          processorOptions: {
            numberOfChannels: 1,
            sampleRate: audioContext.sampleRate,
            maxFrameCount: (audioContext.sampleRate * 1) / 10,
          },
        });
        mediaRecorder.port.onmessageerror = (error) => {
          console.log(`Error receving message from worklet ${error}`);
          setErrorMsg(`${error.toString()}`);
        };
      }

      const destination = audioContext.createMediaStreamDestination();
      mediaRecorder.port.postMessage({ message: "UPDATE_RECORDING_STATE", setRecording: true });
      mediaStreamSource.connect(mediaRecorder).connect(destination);

      const audioDataIterator = pEventIterator<"message", MessageEvent<MessageDataType>>(mediaRecorder.port, "message");
      await streamAudioToWebSocket(audioDataIterator);
    } catch (error: unknown) {
      console.log(error);
      setErrorMsg(`${error.toString()}`);
    } finally {
      await stopRecording();
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (mediaRecorder) {
      mediaRecorder.port.postMessage({ message: "UPDATE_RECORDING_STATE", setRecording: false });
      mediaRecorder.port.close();
      mediaRecorder.disconnect();
      mediaStream.getTracks().forEach((track) => track.stop());
      mediaStreamSource.disconnect();
      await audioContext.close();
    }
  };

  const toggleTrascription = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const streamAudioToWebSocket = async (audioDataIterator: AsyncIterableIterator<MessageEvent<MessageDataType>>) => {
    const transcribeInput = async function* () {
      for await (const chunk of audioDataIterator) {
        if (chunk.data.message === "SHARE_RECORDING_BUFFER") {
          const abuffer = pcmEncode(chunk.data.buffer[0]);
          const audiodata = new Uint8Array(abuffer);
          yield { AudioEvent: { AudioChunk: audiodata } };
        }
      }
    };

    const { TranscriptResultStream } = await getStreamTranscriptionResponse(transcribeInput());

    if (TranscriptResultStream) {
      let partialTranscription = "";
      for await (const event of TranscriptResultStream) {
        if (event.TranscriptEvent) {
          const { Results: results } = event.TranscriptEvent.Transcript || {};

          if (results && results.length > 0) {
            if (results[0]?.Alternatives && results[0]?.Alternatives?.length > 0) {
              const { Transcript } = results[0].Alternatives[0];

              const transcriptionToRemove = partialTranscription;
              // fix encoding for accented characters.
              const transcription = decodeURIComponent(escape(Transcript || ""));

              setNoteContent((noteContent: any) => noteContent.replace(transcriptionToRemove, "") + transcription);

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
