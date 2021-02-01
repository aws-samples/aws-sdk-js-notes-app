import React from "react";
import { Card } from "react-bootstrap";

const PageContainer = (props: {
  header: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card>
    <Card.Header>{props.header}</Card.Header>
    <Card.Body>{props.children}</Card.Body>
  </Card>
);

export { PageContainer };
