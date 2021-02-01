import * as cdk from "@aws-cdk/core";
import { AwsSdkJsTodoAppStack } from "./aws-sdk-js-todo-app-stack";

const app = new cdk.App();
new AwsSdkJsTodoAppStack(app, "aws-sdk-js-todo-app");
