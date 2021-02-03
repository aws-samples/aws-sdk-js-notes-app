import React, { useState } from "react";
import { Button, Alert, OverlayTrigger, Tooltip } from "react-bootstrap";
import { MicFill, MicMute } from "react-bootstrap-icons";

const RecordAudioButton = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const toggleAudio = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <OverlayTrigger
        placement="top"
        delay={250}
        overlay={<Tooltip id="button-tooltip">Transcribe by voice</Tooltip>}
      >
        <Button
          variant={isRecording ? "primary" : "outline-secondary"}
          size="sm"
          onClick={toggleAudio}
        >
          {isRecording ? <MicFill /> : <MicMute />}
        </Button>
      </OverlayTrigger>
    </>
  );
};

export { RecordAudioButton };
