import { App } from "aws-cdk-lib";
import { AwsSdkJsNotesAppStack } from "./aws-sdk-js-notes-app-stack";

const app = new App();
new AwsSdkJsNotesAppStack(app, "aws-sdk-js-notes-app");
