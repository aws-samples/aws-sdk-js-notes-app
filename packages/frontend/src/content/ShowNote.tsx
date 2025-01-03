import React, { useState, useEffect, useTransition } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Card } from "react-bootstrap";
import { GATEWAY_URL } from "../config";
import { DeleteNoteButton, SaveNoteButton } from "./";
import { getObjectUrl } from "../libs";
import { HomeButton, Loading, PageContainer } from "../components";

const ShowNote = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [noteContent, setNoteContent] = useState("");
  const [attachment, setAttachment] = useState("");
  const [attachmentURL, setAttachmentURL] = useState("");

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
