import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { GATEWAY_URL } from "../config";
import { deleteObject } from "../libs";
import { ButtonSpinner } from "../components";
import { useNavigate } from "react-router-dom";

const DeleteNoteButton = (props: { noteId: string; attachment?: string }) => {
  const { noteId, attachment } = props;
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleDelete = async (event: any) => {
    event.preventDefault();
    setIsDeleting(true);

    const deleteNoteURL = `${GATEWAY_URL}notes/${noteId}`;

    try {
      if (attachment) {
        await deleteObject(attachment);
      }
      await fetch(deleteNoteURL, {
        method: "DELETE",
      });
      navigate("/");
    } catch (error: any) {
      setErrorMsg(`${error.toString()} - ${deleteNoteURL} - ${noteId}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <Button
        variant="danger"
        disabled={isDeleting}
        onClick={handleDelete}
      >
        {isDeleting ? <ButtonSpinner /> : ""}
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </>
  );
};

export { DeleteNoteButton };
