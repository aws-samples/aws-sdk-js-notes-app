import React from "react";
import { Spinner } from "react-bootstrap";

const Loading = () => (
  <div className="d-flex align-items-center gap-2">
    <Spinner animation="border" role="status">
    </Spinner>
    <span className="sr-only">Loading...</span>
  </div>
);

export { Loading };
