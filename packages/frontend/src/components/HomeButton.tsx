import React from "react";
import { Button } from "react-bootstrap";
import { BASE_URL } from "../config";


const HomeButton = () => (
  <Button href={BASE_URL} variant="light" className="border border-secondary">
    &lt; Home
  </Button>
);

export { HomeButton };
