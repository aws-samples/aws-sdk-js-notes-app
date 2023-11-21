import { App } from "aws-cdk-lib";
import { AwsSdkJsNotesAppFrontendStack } from "./aws-sdk-js-notes-app-frontend-stack";

const app = new App();
new AwsSdkJsNotesAppFrontendStack(app, "aws-sdk-js-notes-app-frontend");
