#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { APIGatewayStack, APIGatewayStackProps } from '../lib/api-stack';

const app = new cdk.App();

const apiGatewayStackProps = {
  description: 'The API stack for user-service. This is a root level stack for the user microservice.',
  restApiName: 'userServiceAPI',
  apiDescription: 'This service provides functionality to manager users',
  srcDirectory: '../build',
  lambdaFunctionName: 'user-service-handler',
  terminationProtection: true,
} as APIGatewayStackProps;

// eslint-disable-next-line no-new
new APIGatewayStack(app, 'APIStack', apiGatewayStackProps);
