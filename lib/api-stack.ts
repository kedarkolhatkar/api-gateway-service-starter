import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { TableEncryption } from '@aws-cdk/aws-dynamodb';

/**
 *
 */
export interface APIGatewayStackProps extends cdk.StackProps {
  restApiName: string;
  apiDescription: string;
  srcDirectory: string;
  lambdaFunctionName: string;
}

export class APIGatewayStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: APIGatewayStackProps) {
    super(scope, id, props);

    const userTableName = 'user-table';
    const userTable = new dynamodb.Table(this, `${userTableName}-id`, {
      tableName: userTableName,
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.AWS_MANAGED,
    });

    const lambdaFunctionSrcDir = `${props.srcDirectory}/${props.lambdaFunctionName}`;
    // console.log(path.join(__dirname, lambdaFunctionSrcDir));

    // Define the backend lambda
    const backend = new lambda.Function(this, `${props.lambdaFunctionName}-id`, {
      functionName: props.lambdaFunctionName,
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: `${props.lambdaFunctionName}.handler`,
      code: lambda.Code.fromAsset(path.join(__dirname, lambdaFunctionSrcDir)),
      environment: {
        USER_TABLE_ARN: userTable.tableArn,
        USER_TABLE_NAME: userTableName,
      },
    });

    userTable.grantReadWriteData(backend);

    // Create User API
    const api = new apigateway.LambdaRestApi(this, 'user-api', {
      restApiName: props.restApiName,
      description: props.apiDescription,
      handler: backend,
    });
  }
}
