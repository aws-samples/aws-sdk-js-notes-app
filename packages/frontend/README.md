# @aws-sdk-notes-app/frontend

- This package contains frontend code which performs:
  - Put, Get, Delete operations on S3 client.
  - StartStreamTranscription operation on TranscribeStreaming client.
  - SynthesizeSpeech operation on Polly client.
- This is a create-react-app which creates minimized bundle on running `build`, and debugs it on running `start`.

  <details><summary>Click to view screen recordings</summary>
  <p>

  [![Screen recording](https://img.youtube.com/vi/qBltinDalzU/0.jpg)](https://www.youtube.com/watch?v=qBltinDalzU)

  [![Screen recording](https://img.youtube.com/vi/fF9zd0YJn6A/0.jpg)](https://www.youtube.com/watch?v=fF9zd0YJn6A)

  [![Screen recording](https://img.youtube.com/vi/tNI05dyeyqY/0.jpg)](https://www.youtube.com/watch?v=tNI05dyeyqY)

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
  - Add `aws-js-sdk-notes-app.FilesBucket` from CDK output for `FILES_BUCKET`.
  - Add `aws-js-sdk-notes-app.GatewayUrl` from CDK output for `GATEWAY_URL`.
    - Example GatewayURL: `https://randomstring.execute-api.region.amazonaws.com/prod/`
  - Add `aws-js-sdk-notes-app.IdentityPoolId` from CDK output for `IDENTITY_POOL_ID`.
    - Example IdentityPoolId: `region:random-strc-4ce1-84ee-9a429f9b557e`
  - Add `aws-js-sdk-notes-app.Region` from CDK output for `REGION`.
- `yarn start:frontend` to run the server.
  - This will open the website in the browser, and enable HMR.
  - Just edit and save the files in `packages/frontend/src`, and the browser page will auto-refresh!
- `yarn build:frontend` to create optimized production build (to get file sizes).

### Clean resources

- Run `yarn cdk destroy` to delete Cloudformation Stack.
