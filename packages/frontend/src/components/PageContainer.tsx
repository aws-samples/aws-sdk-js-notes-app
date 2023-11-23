import React from "react";
import { Card } from "react-bootstrap";
import { ThemeSwitch } from "../content/ThemeSwitch";

const PageContainer = (props: {
  header: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <>
    <Card>
      <Card.Header>{props.header}</Card.Header>
      <Card.Body>{props.children}</Card.Body>
    </Card>
    <ThemeSwitch />
    </>
  )
};

export { PageContainer };
