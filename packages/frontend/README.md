# S3 browser client

- This package contains frontend code which does put, get, delete operations using S3 browser client.
- This is a create-react-app which creates minimized bundle on running `build`, and debugs it on running `start`.

  <details><summary>Click to view screen recording</summary>
  <p>

  [![Screen recording](https://img.youtube.com/vi/qBltinDalzU/0.jpg)](https://www.youtube.com/watch?v=qBltinDalzU)

  </p>
  </details>

## Table of Contents

- [Setup](#setup)
  - [Steps to run frontend locally](#steps-to-run-frontend-locally)
  - [Clean resources](#clean-resources)

## Setup

Ensure that you've followed pre-requisites from main [README](../../README.md), and created [backend](../backend/README.md).

### Steps to run frontend locally

- `yarn prepare:frontend` to populate Cloudformation resources in frontend config.
- The resources can also be manually added in [`src/config.json`](./src/config.json).
  - Add `aws-js-sdk-todo-app.GatewayUrl` from CDK output for `GATEWAY_URL`.
    - Example GatewayURL: `https://randomstring.execute-api.us-west-2.amazonaws.com/prod/`
  - Add `aws-js-sdk-todo-app.IdentityPoolId` from CDK output for `IDENTITY_POOL_ID`.
    - Example IdentityPoolId: `us-west-2:random-strc-4ce1-84ee-9a429f9b557e`
  - Add `aws-js-sdk-todo-app.FilesBucket` from CDK output for `FILES_BUCKET`.
- `yarn start:frontend` to run the server.
  - This will open the website in the browser, and enable HMR.
  - Just edit and save the files in `packages/frontend/src`, and the browser page will auto-refresh!
- `yarn build:frontend` to create optimized production build (to get file sizes).

### Clean resources

- Run `yarn cdk destroy` to delete Cloudformation Stack.
