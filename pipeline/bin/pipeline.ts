#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PipelineStack, PipelineStackProps } from '../lib/pipeline-stack';

const app = new cdk.App();

const pipelineStackProps = {
  projectName: 'hamlet',
  serviceName: 'user-service',
  repoName: 'hamlet-user-service',
  repoOwner: 'kedarkolhatkar',
  repoAccessTokenName: 'hamlet-github-token',
  branch: 'HAMLET-10-create-pipeline',
} as PipelineStackProps;

new PipelineStack(app, `user-service-PipelineStack`, pipelineStackProps);
