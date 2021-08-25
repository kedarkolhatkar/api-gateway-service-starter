import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { APIGatewayStack, APIGatewayStackProps } from '../../lib/api-stack';

// Skipping for now. We should write fine grained tests instead
test.skip('APIGatewayStack', () => {
  const app = new cdk.App();
  // WHEN
  const props = {
    description: 'The API stack for user-service. This is a root level stack for the user microservice.',
    restApiName: 'userServiceAPI',
    apiDescription: 'This service provides functionality to manager users',
    srcDirectory: '../build',
    lambdaFunctionName: 'user-service-handler',
    terminationProtection: true,
  } as APIGatewayStackProps;

  const stack = new APIGatewayStack(app, 'MyTestStack', props);
  // THEN
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test('APIGatewayStack has core resources', () => {
  const app = new cdk.App();
  // WHEN
  const props = {
    description: 'The API stack for user-service. This is a root level stack for the user microservice.',
    restApiName: 'userServiceAPI',
    apiDescription: 'This service provides functionality to manager users',
    srcDirectory: '../build',
    lambdaFunctionName: 'user-service-handler',
    terminationProtection: true,
  } as APIGatewayStackProps;

  const stack = new APIGatewayStack(app, 'MyTestStack', props);

  expectCDK(stack).to(
    haveResource('AWS::DynamoDB::Table', {
      KeySchema: [
        {
          AttributeName: 'userId',
          KeyType: 'HASH',
        },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    }),
  );

  expectCDK(stack).to(
    haveResource('AWS::Lambda::Function', {
      FunctionName: 'user-service-handler',
    }),
  );
  expectCDK(stack).to(
    haveResource('AWS::ApiGateway::RestApi', {
      Name: 'userServiceAPI',
    }),
  );
});
