#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { NodeStarterStack } from '../lib/node-starter-stack';

const app = new cdk.App();
new NodeStarterStack(app, 'NodeStarterStack');
