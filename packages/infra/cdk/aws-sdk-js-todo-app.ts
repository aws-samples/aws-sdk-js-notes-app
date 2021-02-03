import * as cdk from "@aws-cdk/core";
import { AwsSdkJsTodoAppStack } from "./aws-sdk-js-notes-app-stack";

const app = new cdk.App();
new AwsSdkJsTodoAppStack(app, "aws-sdk-js-notes-app");
