import React, { useRef, useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { PlayCircle, StopFill } from "react-bootstrap-icons";
import { getSynthesizedSpeechResponse } from "../libs/getSynthesizedSpeechResponse";

const PlayAudioButton = (props: {
  isPlaying: boolean;
  setIsPlaying: Function;
  noteContent: string;
}) => {
  const { isPlaying, setIsPlaying, noteContent } = props;
  const audioPlayer = useRef<HTMLAudioElement>();
  const [errorMsg, setErrorMsg] = useState("");

  const togglePlay = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioPlayer.current?.pause();
      audioPlayer.current?.load();
    } else {
      setIsPlaying(true);
      try {
        const { AudioStream } = await getSynthesizedSpeechResponse(noteContent);
        audioPlayer.current?.play();
      } catch (error) {
        console.log(error);
        setErrorMsg(`${error.toString()}`);
      }
    }
  };

  return (
    <>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <audio
        // @ts-ignore
        ref={audioPlayer}
        src="https://d1.awsstatic.com/product-marketing/Polly/voices/features_joanna_news.dfd96576dcc6e1f906111c9938748773f3431213.mp3"
        controls
      ></audio>
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
