import {
  Stack,
  StackProps,
  CfnOutput,
  aws_s3 as s3,
  aws_s3_deployment,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class AwsSdkJsNotesAppFrontendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      bucketName: "notes-app-frontend",
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
    });

    new aws_s3_deployment.BucketDeployment(this, "DeployWebsite", {
      sources: [aws_s3_deployment.Source.asset("../frontend/dist")],
      destinationBucket: websiteBucket,
    });

    new CfnOutput(this, "FrontendBucketWebsite", {
      value: `http://${websiteBucket.bucketName}.s3-website.localhost.localstack.cloud:4566/`,
    });
  }
}
