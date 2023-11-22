import {
  Stack,
  StackProps,
  CfnOutput,
  aws_apigateway as apigw,
  aws_cognito as cognito,
  aws_dynamodb as dynamodb,
  aws_iam as iam,
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { NotesApi } from "./notes-api";

export class AwsSdkJsNotesAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "notes", {
      partitionKey: { name: "noteId", type: dynamodb.AttributeType.STRING },
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

    const filesBucket = new s3.Bucket(this, "files-bucket");
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

    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      bucketName: "notes-app-frontend",
    });

    const distribution = new cloudfront.Distribution(this, "WebsiteDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    new CfnOutput(this, "FilesBucket", { value: filesBucket.bucketName });
    new CfnOutput(this, "GatewayId", { value: api.restApiId });
    new CfnOutput(this, "IdentityPoolId", { value: identityPool.ref });
    new CfnOutput(this, "Region", { value: this.region });
    new CfnOutput(this, "FrontendDistributionId", { value: distribution.distributionId });

  }
}
