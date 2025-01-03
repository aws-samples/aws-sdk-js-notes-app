import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes as ReactRoutes } from "react-router-dom";

const ListNotes = lazy(() => import("./content/ListNotes"));
const CreateNote = lazy(() => import("./content/CreateNote"));
const ShowNote = lazy(() => import("./content/ShowNote"));
const NotFound = lazy(() => import("./content/NotFound"));

const Routes = () => (
  <div className="mt-md-4 d-flex flex-column justify-content-center">
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <ReactRoutes>
          <Route path="/" element={<ListNotes />} />
          <Route path="/note/new" element={<CreateNote />} />
          <Route path="/notes/:noteId" element={<ShowNote />} />
          <Route path="*" element={<NotFound />} />
        </ReactRoutes>
      </Router>
    </Suspense>
  </div>
);

export { Routes };
