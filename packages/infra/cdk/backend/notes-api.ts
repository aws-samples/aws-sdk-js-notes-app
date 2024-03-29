import {
  aws_dynamodb as dynamodb,
  aws_lambda_nodejs as lambda,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export interface NotesApiProps {
  /** the dynamodb table to be passed to lambda function **/
  table: dynamodb.Table;
  /** the actions which should be granted on the table */
  grantActions: string[];
}

export class NotesApi extends Construct {
  /** allows accessing the counter function */
  public readonly handler: lambda.NodejsFunction;

  constructor(scope: Construct, id: string, props: NotesApiProps) {
    super(scope, id);

    const { table, grantActions } = props;

    this.handler = new lambda.NodejsFunction(this, id, {
      handler: "app.handler",
      environment: {
        NOTES_TABLE_NAME: table.tableName,
      },
    });

    // grant the lambda role read/write permissions to notes table
    table.grant(this.handler, ...grantActions);
  }
}
