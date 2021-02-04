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
  const player = new Audio(
    "https://d1.awsstatic.com/product-marketing/Polly/voices/joanna.84722a684fbb16e766944ea6e34dd0042195571c.mp3"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const togglePlay = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      player.pause();
    } else {
      setIsPlaying(true);
      try {
        const { AudioStream } = await getSynthesizedSpeechResponse(noteContent);
        player.play();
      } catch (error) {
        console.log(error);
        setErrorMsg(`${error.toString()}`);
      }
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
