#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaStack } from '../lib/lambda-stack';

const app = new cdk.App();
// eslint-disable-next-line no-new
new LambdaStack(app, 'LambdaStack');
