import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { PlayCircle, StopFill } from "react-bootstrap-icons";

const PlayAudioButton = (props: {
  isPlaying: boolean;
  setIsPlaying: Function;
  noteContent: string;
}) => {
  const { isPlaying, setIsPlaying, noteContent } = props;
  const [errorMsg, setErrorMsg] = useState("");

  const togglePlay = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      // if (micStream) {
      //   micStream.stop();
      //   setMicStream(undefined);
      // }
    } else {
      setIsPlaying(true);
      // let mic;
      // try {
      //   const audio = await navigator.mediaDevices.getUserMedia({
      //     audio: true,
      //     video: false,
      //   });
      //   mic = new MicrophoneStream();
      //   mic.setStream(audio);
      //   setMicStream(mic);
      //   await streamAudioToWebSocket(mic);
      // } catch (error) {
      //   console.log(error);
      //   setErrorMsg(`${error.toString()}`);
      // } finally {
      //   if (mic) {
      //     mic.stop();
      //     setMicStream(undefined);
      //   }
      //   setIsRecording(false);
      // }
    }
  };

  return (
    <>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <Button
        className="mx-2"
        variant={isPlaying ? "primary" : "outline-secondary"}
        size="sm"
        onClick={togglePlay}
      >
        {isPlaying ? <StopFill /> : <PlayCircle />}
      </Button>
    </>
  );
};

export { PlayAudioButton };
