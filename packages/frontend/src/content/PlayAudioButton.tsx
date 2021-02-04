import React, { useRef, useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { PlayCircle, StopFill } from "react-bootstrap-icons";
import { getSynthesizedSpeechUrl } from "../libs/getSynthesizedSpeechUrl";

const PlayAudioButton = (props: {
  isPlaying: boolean;
  setIsPlaying: Function;
  noteContent: string;
}) => {
  const { isPlaying, setIsPlaying, noteContent } = props;
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const togglePlay = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioPlayer.current?.pause();
      audioPlayer.current?.load();
    } else {
      setIsPlaying(true);
      try {
        const audioUrl = await getSynthesizedSpeechUrl(noteContent);
        setAudioUrl(audioUrl.toString());
        audioPlayer.current?.load();
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
      <audio ref={audioPlayer} src={audioUrl}></audio>
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
