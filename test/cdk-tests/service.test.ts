import { expect as expectCDK, matchTemplate, MatchStyle, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { APIGatewayStack, APIGatewayStackProps } from '../../lib/api-stack';

test('APIGatewayStack', () => {
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
