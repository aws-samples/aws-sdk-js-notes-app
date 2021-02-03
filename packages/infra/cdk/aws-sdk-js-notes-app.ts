import * as cdk from "@aws-cdk/core";
import { AwsSdkJsNotesAppStack } from "./aws-sdk-js-notes-app-stack";

const app = new cdk.App();
new AwsSdkJsNotesAppStack(app, "aws-sdk-js-notes-app");
