import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { PlayCircle, StopFill } from "react-bootstrap-icons";
import { getSynthesizedSpeechResponse } from "../libs/getSynthesizedSpeechResponse";

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
    } else {
      setIsPlaying(true);
      try {
        const { AudioStream } = await getSynthesizedSpeechResponse(noteContent);
        console.log(AudioStream);
      } catch (error) {
        console.log(error);
        setErrorMsg(`${error.toString()}`);
      } finally {
        setIsPlaying(false);
      }
    }
  };

  return (
    <>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <audio id="player"></audio>
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
