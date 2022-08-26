import React, { lazy, Suspense } from "react";
import { Routes as ReactRouterRoutes, Route } from "react-router-dom";
import { CreateNote, ListNotes, ShowNote, NotFound } from "./content";

const Routes = () => (
  <div className="mt-md-4 d-flex flex-column justify-content-center">
    <ReactRouterRoutes>
      <Route path="/" element={<ListNotes />} />
      <Route path="notes">
        <Route path="new" element={<CreateNote />} />
        <Route path=":noteId" element={<ShowNote />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </ReactRouterRoutes>
  </div>
);

export { Routes };
