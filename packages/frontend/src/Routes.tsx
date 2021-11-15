import React, { lazy, Suspense } from "react";
import { Routes } from "react-router-dom";

const ListNotes = lazy(() => import("./content/ListNotes"));
const CreateNote = lazy(() => import("./content/CreateNote"));
const ShowNote = lazy(() => import("./content/ShowNote"));
const NotFound = lazy(() => import("./content/NotFound"));

const Routes = () => (
  <div className="mt-md-4 d-flex flex-column justify-content-center">
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <ListNotes path="/" />
        <CreateNote path="/note/new" />
        <ShowNote path="/notes/:noteId" />
        <NotFound default />
      </Routes>
    </Suspense>
  </div>
);

export { Routes };
