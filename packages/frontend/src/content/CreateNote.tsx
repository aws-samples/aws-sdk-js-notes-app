import React, { useState, FormEvent } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GATEWAY_URL, MAX_FILE_SIZE } from "../config.json";
import { putObject } from "../libs";
import { HomeButton, ButtonSpinner, PageContainer } from "../components";
import { RecordAudioButton } from "./RecordAudioButton";
import { PlayAudioButton } from "./PlayAudioButton";

const CreateNote = (props: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [file, setFile] = useState();

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // @ts-ignore Object is possibly 'undefined'
    if (file && file.size > MAX_FILE_SIZE) {
      setErrorMsg(`File can't be bigger than ${MAX_FILE_SIZE / 1000000} MB`);
      return;
    }

    setIsLoading(true);

    const createNoteURL = `${GATEWAY_URL}notes`;

    try {
      // @ts-ignore Argument of type 'undefined' is not assignable to parameter of type 'File'
      const attachment = file ? await putObject(file) : undefined;
      await fetch(createNoteURL, {
        method: "POST",
        body: JSON.stringify({ attachment, content: noteContent }),
      });
      useNavigate()("/");
    } catch (error) {
      setErrorMsg(`${error.toString()} - ${createNoteURL} - ${noteContent}`);
    } finally {
      setIsLoading(false);
    }
  };

  const noteContentAdditionalProps =
    isRecording || isPlaying ? { disabled: true, value: noteContent } : {};

  return (
    <PageContainer header={<HomeButton />}>
      <form onSubmit={handleSubmit}>
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
        <Form.Group controlId="content">
          <Form.Label>Note Content</Form.Label>
          <Form.Control
            as="textarea"
            placeholder={isRecording ? "Speak Now" : "Enter Note content"}
            onChange={(e) => {
              const content = e.currentTarget.value;
              if (content) {
                setNoteContent(content);
              }
            }}
            {...noteContentAdditionalProps}
          />
        </Form.Group>
        <Form.Group>
          <RecordAudioButton
            disabled={isPlaying}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            setNoteContent={setNoteContent}
          />
          <PlayAudioButton
            disabled={isRecording}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            noteContent={noteContent}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          <Form.Control
            onChange={(e) => {
              // @ts-ignore Property 'files' does not exist on type
              setFile(e.target.files[0]);
            }}
            type="file"
          />
        </Form.Group>
        <Button type="submit" disabled={!noteContent || isLoading} block>
          {isLoading ? <ButtonSpinner /> : ""}
          {isLoading ? "Creating..." : "Create"}
        </Button>
      </form>
    </PageContainer>
  );
};

export default CreateNote;
