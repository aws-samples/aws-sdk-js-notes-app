import React, { useState, useTransition, useEffect } from "react";
import { Link} from "react-router-dom";
import { GATEWAY_URL } from "../config";
import { Card, Alert, CardColumns, Button } from "react-bootstrap";
import { Loading, PageContainer } from "../components";
interface Note {
  noteId: string;
  createdAt: string;
  content: string;
  attachment: boolean;
}

const ListNotes = () => {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = () => {
      startTransition(async () => {
        const fetchURL = `${GATEWAY_URL}notes`;

        try {
          const response = await fetch(fetchURL);
          const data = await response.json();
          setNotes(data);
        } catch (error) {
          setErrorMsg(`${error.toString()} - ${fetchURL}`);
        }
      });
    };
    fetchNotes();
  }, []);

  const renderNotes = (notes: Note[]) =>
    notes.map((note) => (
      <Link key={note.noteId} to={`/notes/${note.noteId}`}>
        <Card>
          <Card.Body>
            <Card.Title>
              {note.attachment && (
                <span role="img" aria-label="attachment" className="mr-1">
                  📎
                </span>
              )}
              {note.content}
            </Card.Title>
            <Card.Subtitle className="text-muted">
              Created: {new Date(parseInt(note.createdAt)).toLocaleString()}
            </Card.Subtitle>
          </Card.Body>
        </Card>
      </Link>
    ));

  const createNewNote = () => (
    <Link key="new" to="note/new">
      <Button variant="primary" block>
        Create a new note
      </Button>
    </Link>
  );

  return (
    <PageContainer header={<div>Your Notes</div>}>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      {isPending ? (
        <Loading />
      ) : (
        <div>
          <CardColumns>{renderNotes(notes)}</CardColumns>
          {createNewNote()}
        </div>
      )}
    </PageContainer>
  );
};

export default ListNotes;
