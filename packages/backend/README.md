# @aws-sdk-notes-app/backend

- This package contains backend code which performs Create, Delete, Get, Scan and Update operations on DynamoDB.
- It uses webpack to build single minimized bundle for each operation, and AWS CDK to deploy those bundles.

## Table of Contents

- [Setup](#setup)
  - [Create backend API](#create-backend-api)
  - [Test backend API](#test-backend-api)
  - [Clean resources](#clean-resources)

## Setup

Ensure that you've followed pre-requisites from main [README](../../README.md).

### Create backend API

- `yarn build:backend` to build the package (runs ESLint and TypeScript).
- `yarn cdk deploy` to deploy your application (this operation might take time based on the state of your Cloudformation stack).

### Test backend API

- Open the GatewayUrl link from CDK output from the console.
  - It'll be like: https://randomstring.execute-api.region.amazonaws.com/prod/
- Append `notes` in the URL.
  - It'll be like: https://randomstring.execute-api.region.amazonaws.com/prod/notes
- The contents of the notes DynamoDB table would be returned as JSON.
- If you don't see anything, that's because your table is likely empty! Add data manually or wait until you run the frontend.

### Clean resources

- Note: Clean resources after you're done with all activities below, and you want to delete your cloudformation stack.
- `yarn cdk destroy` to delete your CloudFormation stack.
