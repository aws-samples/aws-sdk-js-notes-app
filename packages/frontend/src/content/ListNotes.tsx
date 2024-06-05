import React, { useState, useEffect } from "react";
import { GATEWAY_URL } from "../config";
import { Card, Alert, Button } from "react-bootstrap";
import { Loading, PageContainer } from "../components";
import { Link } from "react-router-dom";
interface Note {
  noteId: string;
  createdAt: string;
  content: string;
  attachment: boolean;
}

const ListNotes = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      const fetchURL = `${GATEWAY_URL}notes`;

      try {
        const response = await fetch(fetchURL);
        const data = await response.json();
        setNotes(data);
      } catch (error: any) {
        setErrorMsg(`${error.toString()} - ${fetchURL}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const renderNotes = (notes: Note[]) =>
    notes.map((note) => (
      <Link key={note.noteId} to={`/notes/${note.noteId}`} className="col-md-4 col-12 text-decoration-none">
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
      <Button variant="primary" className="mt-4">
        Create a new note
      </Button>
    </Link>
  );

  return (
    <PageContainer header={<div>Your Notes</div>}>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="container">
          <div className="row row-cols-3 gx-3 gy-3">
          {renderNotes(notes)}
          </div>
          {createNewNote()}
        </div>
      )}
    </PageContainer>
  );
};

export default ListNotes;
