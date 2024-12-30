import React, { useState, useTransition } from "react";
import { Button, Alert } from "react-bootstrap";
import { GATEWAY_URL } from "../config";
import { navigate } from "@reach/router";
import { deleteObject } from "../libs";
import { ButtonSpinner } from "../components";

const DeleteNoteButton = (props: { noteId: string; attachment?: string }) => {
  const { noteId, attachment } = props;
  const [isDeleting, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const deleteNoteURL = `${GATEWAY_URL}notes/${noteId}`;

      try {
        if (attachment) {
          await deleteObject(attachment);
        }
        await fetch(deleteNoteURL, {
          method: "DELETE",
        });
        navigate("/");
      } catch (error) {
        setErrorMsg(`${error.toString()} - ${deleteNoteURL} - ${noteId}`);
      }
    });
  };

  return (
    <>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <Button variant="danger" disabled={isDeleting} onClick={handleDelete} block>
        {isDeleting ? <ButtonSpinner /> : ""}
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </>
  );
};

export { DeleteNoteButton };
