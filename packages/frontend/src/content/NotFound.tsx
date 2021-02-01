import React from "react";
import { RouteComponentProps } from "@reach/router";
import { HomeButton, PageContainer } from "../components";

const NotFound = (props: RouteComponentProps) => (
  <PageContainer header={<HomeButton />}>404 Page Not Found</PageContainer>
);

export default NotFound;
