import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as s3 from "@aws-cdk/aws-s3";
import * as cognito from "@aws-cdk/aws-cognito";
import * as iam from "@aws-cdk/aws-iam";
import { NotesApi } from "./notes-api";

export class AwsSdkJsNotesAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "notes", {
      partitionKey: { name: "noteId", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    const api = new apigw.RestApi(this, "endpoint");
    const notes = api.root.addResource("notes");
    notes.addMethod(
      "GET",
      new apigw.LambdaIntegration(
        new NotesApi(this, "listNotes", {
          table,
          grantActions: ["dynamodb:Scan"],
        }).handler
      )
    );
    notes.addMethod(
      "POST",
      new apigw.LambdaIntegration(
        new NotesApi(this, "createNote", {
          table,
          grantActions: ["dynamodb:PutItem"],
        }).handler
      )
    );

    const note = notes.addResource("{id}", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
      },
    });
    note.addMethod(
      "GET",
      new apigw.LambdaIntegration(
        new NotesApi(this, "getNote", {
          table,
          grantActions: ["dynamodb:GetItem"],
        }).handler
      )
    );
    note.addMethod(
      "PUT",
      new apigw.LambdaIntegration(
        new NotesApi(this, "updateNote", {
          table,
          grantActions: ["dynamodb:UpdateItem"],
        }).handler
      )
    );
    note.addMethod(
      "DELETE",
      new apigw.LambdaIntegration(
        new NotesApi(this, "deleteNote", {
          table,
          grantActions: ["dynamodb:DeleteItem"],
        }).handler
      )
    );

    const filesBucket = new s3.Bucket(this, "files-bucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });
    filesBucket.addCorsRule({
      allowedOrigins: apigw.Cors.ALL_ORIGINS, // NOT recommended for production code
      allowedMethods: [
        s3.HttpMethods.PUT,
        s3.HttpMethods.GET,
        s3.HttpMethods.DELETE,
      ],
      allowedHeaders: ["*"],
    });

    const identityPool = new cognito.CfnIdentityPool(this, "identity-pool", {
      allowUnauthenticatedIdentities: true,
    });

    const unauthenticated = new iam.Role(this, "unauthenticated-role", {
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "unauthenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });

    // NOT recommended for production code - only give read permissions for unauthenticated resources
    filesBucket.grantRead(unauthenticated);
    filesBucket.grantPut(unauthenticated);
    filesBucket.grantDelete(unauthenticated);

    // Add policy to start Transcribe stream transcription
    unauthenticated.addToPolicy(
      new iam.PolicyStatement({
        resources: ["*"],
        actions: ["transcribe:StartStreamTranscriptionWebSocket"],
      })
    );

    // Add policy to enable Amazon Polly text-to-speech
    unauthenticated.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonPollyFullAccess")
    );

    new cognito.CfnIdentityPoolRoleAttachment(this, "role-attachment", {
      identityPoolId: identityPool.ref,
      roles: {
        unauthenticated: unauthenticated.roleArn,
      },
    });

    new cdk.CfnOutput(this, "FilesBucket", { value: filesBucket.bucketName });
    new cdk.CfnOutput(this, "GatewayUrl", { value: api.url });
    new cdk.CfnOutput(this, "IdentityPoolId", { value: identityPool.ref });
    new cdk.CfnOutput(this, "Region", { value: this.region });
  }
}
