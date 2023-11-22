import {
  Stack,
  StackProps,
  aws_s3,
  aws_s3_deployment,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class AwsSdkJsNotesAppFrontendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = aws_s3.Bucket.fromBucketName(this, "WebsiteBucket", "notes-app-frontend");

    new aws_s3_deployment.BucketDeployment(this, "DeployWebsite", {
      sources: [aws_s3_deployment.Source.asset("../frontend/dist")],
      destinationBucket: bucket,
    });


  }
}
