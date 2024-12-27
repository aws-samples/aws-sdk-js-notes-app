import React, { useState, useEffect, useTransition } from "react";
import { RouteComponentProps, navigate } from "@reach/router";
import { Form, Card } from "react-bootstrap";
import { GATEWAY_URL } from "../config";
import { DeleteNoteButton, SaveNoteButton } from "./";
import { getObjectUrl } from "../libs";
import { HomeButton, Loading, PageContainer } from "../components";

const ShowNote = (props: RouteComponentProps<{ noteId: string }>) => {
  const { noteId } = props;
  const [noteContent, setNoteContent] = useState("");
  const [attachment, setAttachment] = useState("");
  const [attachmentURL, setAttachmentURL] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (noteId) {
      startTransition(async () => {
      const fetchURL = `${GATEWAY_URL}notes/${noteId}`;

      try {
        const response = await fetch(fetchURL);
        const data = await response.json();
        setNoteContent(data.content);
        if (data.attachment) {
          setAttachment(data.attachment);
          setAttachmentURL(await getObjectUrl(data.attachment));
        }
      } catch (error) {
        console.error(error);
        setErrorMsg("Failed to load note. Redirecting...");
        // Navigate to 404 page, as noteId probably not present
        navigate("/404");
      }
      });
    }
  }, [noteId]);

  return (
    <PageContainer header={<HomeButton />}>
      {isPending ? (
        <Loading />
      ) : (
        <form>
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
          <Form.Group controlId="content">
            <Form.Label>Note Content</Form.Label>
            <Form.Control
              as="textarea"
              defaultValue={noteContent}
              onChange={(e) => {
                const content = e.currentTarget.value;
                if (content) {
                  setNoteContent(content);
                }
              }}
            />
          </Form.Group>
          {attachmentURL && (
            <Form.Group>
              <Form.Label>Attachment</Form.Label>
              <Form.Text>
                <Card.Link href={attachmentURL}>
                  <span role="img" aria-label="attachment" className="mr-1">
                    📎
                  </span>
                  {attachment.replace(/^\w+-/, "")}
                </Card.Link>
              </Form.Text>
            </Form.Group>
          )}
          <SaveNoteButton noteId={noteId || ""} noteContent={noteContent} />
          <DeleteNoteButton noteId={noteId || ""} attachment={attachment} />
        </form>
      )}
    </PageContainer>
  );
};

export default ShowNote;
