import * as cdk from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import { LogGroup } from '@aws-cdk/aws-logs';
import { Effect, PolicyStatement, Role } from '@aws-cdk/aws-iam';

export interface PipelineStackProps extends cdk.StackProps {
  projectName: string;
  serviceName: string;
  buildspecsDir?: string;
  repoName: string;
  repoOwner: string;
  repoAccessTokenName: string;
  branch?: string;
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const defaultProps = { buildSpecsDir: 'pipeline/buildspecs', branch: 'main' };
    const finalProps = { ...defaultProps, ...props };

    // First build the code build project
    const cdkBuildProject = new codebuild.PipelineProject(this, `${finalProps.serviceName}-build-1`, {
      projectName: `${finalProps.serviceName}-build-project`,
      description: `This code build project for ${finalProps.serviceName} compiles, unit tests and deploys to development environment`,
      buildSpec: codebuild.BuildSpec.fromSourceFilename('pipeline/buildspecs/dev.yaml'),
      concurrentBuildLimit: 1,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
      },
      logging: {
        cloudWatch: {
          enabled: true,
          logGroup: new LogGroup(this, `${finalProps.serviceName}-build-log-group-id`, {
            logGroupName: `${finalProps.serviceName}-build-logs`,
            retention: 7,
          }),
          prefix: `${finalProps.serviceName}`,
        },
      },
    });

    // Policy to create/update/delete AWS resources
    const awsAssetsPolicyStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: ['*'],
      actions: ['*'],
      conditions: {
        'ForAnyValue:StringEquals': {
          'aws:CalledVia': ['cloudformation.amazonaws.com'],
        },
      },
    });

    cdkBuildProject.addToRolePolicy(awsAssetsPolicyStatement);

    // Policy for access to CloudFormation stacks
    const accessStackPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: ['arn:aws:cloudformation:us-east-1:729288039836:stack/*'],
      actions: [
        'cloudformation:DescribeStacks',
        'cloudformation:GetTemplate',
        'cloudformation:DeleteChangeSet',
        'cloudformation:CreateChangeSet',
        'cloudformation:DescribeChangeSet',
        'cloudformation:ExecuteChangeSet',
        'cloudformation:DescribeStackEvents',
      ],
    });
    cdkBuildProject.addToRolePolicy(accessStackPolicy);

    // Policy to access S3 bucket where deployment artificats are stored
    const s3bucketAccessPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: ['arn:aws:s3:::cdk-*', 'arn:aws:s3:::codepipeline-us-east-1-*'],
      actions: [
        's3:PutObject',
        's3:GetObject',
        's3:GetObjectVersion',
        's3:GetBucketAcl',
        's3:GetBucketLocation',
        's3:ListBucket',
      ],
    });

    cdkBuildProject.addToRolePolicy(s3bucketAccessPolicy);

    const sourceOutput = new codepipeline.Artifact('SrcOutput');
    const githubToken = cdk.SecretValue.secretsManager(finalProps.repoAccessTokenName);

    // Create code pipeline
    // TODO: Use SecretManager to get token
    new codepipeline.Pipeline(this, `${finalProps.serviceName}-pipeline`, {
      restartExecutionOnUpdate: true,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipelineActions.GitHubSourceAction({
              actionName: 'Checkout',
              output: sourceOutput,
              repo: finalProps.repoName,
              branch: finalProps.branch,
              owner: finalProps.repoOwner,
              oauthToken: githubToken,
            }),
          ],
        },
        {
          stageName: 'Build',
          actions: [
            new codepipelineActions.CodeBuildAction({
              actionName: 'build',
              project: cdkBuildProject,
              input: sourceOutput,
            }),
          ],
        },
      ],
    });
  }
}
