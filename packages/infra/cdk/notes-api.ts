import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda-nodejs";
import { Table } from "@aws-cdk/aws-dynamodb";

export interface NotesApiProps {
  /** the dynamodb table to be passed to lambda function **/
  table: Table;
  /** the actions which should be granted on the table */
  grantActions: string[];
}

export class NotesApi extends cdk.Construct {
  /** allows accessing the counter function */
  public readonly handler: lambda.NodejsFunction;

  constructor(scope: cdk.Construct, id: string, props: NotesApiProps) {
    super(scope, id);

    const { table, grantActions } = props;

    this.handler = new lambda.NodejsFunction(this, "handler", {
      // ToDo: find a better way to pass lambda code
      entry: `../backend/dist/${id}/app.js`,
      environment: {
        NOTES_TABLE_NAME: table.tableName,
      },
    });

    // grant the lambda role read/write permissions to notes table
    table.grant(this.handler, ...grantActions);
  }
}
