import React, { lazy, Suspense } from "react";
import { Routes as ReactRouterRoutes, Route } from "react-router-dom";

const ListNotes = lazy(() => import("./content/ListNotes"));
const CreateNote = lazy(() => import("./content/CreateNote"));
const ShowNote = lazy(() => import("./content/ShowNote"));
const NotFound = lazy(() => import("./content/NotFound"));

const Routes = () => (
  <div className="mt-md-4 d-flex flex-column justify-content-center">
    <Suspense fallback={<div>Loading...</div>}>
      <ReactRouterRoutes>
        <Route path="/" element={<ListNotes />}>
          <Route index element={<ListNotes />} />
          <Route path="notes" element={<ListNotes />}>
            <Route path="new" element={<CreateNote />} />
            <Route path=":noteId" element={<ShowNote />} />
          </Route>
          <Route element={<NotFound />} />
        </Route>
      </ReactRouterRoutes>
    </Suspense>
  </div>
);

export { Routes };
