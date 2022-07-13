import React from "react";
import { Container, Row, Col, Navbar } from "react-bootstrap";

const PageContainer = (props: {
  header: React.ReactNode;
  children: React.ReactNode;
}) => (
  <>
    <Navbar bg="light">
      <Container>
        <Navbar.Brand>{props.header}</Navbar.Brand>
      </Container>
    </Navbar>
    <Container>
      <Row>
        <Col>{props.children}</Col>
      </Row>
    </Container>
  </>
);

export { PageContainer };
