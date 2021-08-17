import * as cdk from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import { LogGroup } from '@aws-cdk/aws-logs';

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // First build the code build project
    const cdkBuild = new codebuild.PipelineProject(this, 'user-service-build-1', {
      projectName: 'user-service-build-project',
      description: 'This code build project, compiles, unit tests and deploys to development environment',
      buildSpec: codebuild.BuildSpec.fromSourceFilename('pipeline/buildspecs/dev.yaml'),
      concurrentBuildLimit: 1,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
      },
      logging: {
        cloudWatch: {
          enabled: true,
          logGroup: LogGroup.fromLogGroupName(this, 'user-service-buildlogs-id', 'hamlet-buildlogs'),
          prefix: 'user-service-buildlogs',
        },
      },
    });

    const sourceOutput = new codepipeline.Artifact('SrcOutput');
    const githubToken = cdk.SecretValue.secretsManager('hamlet-github-token');
    console.log(`github token: ${githubToken}`);

    // Create code pipeline
    // TODO: Use SecretManager to get token
    new codepipeline.Pipeline(this, 'user-service-pipeline', {
      restartExecutionOnUpdate: true,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipelineActions.GitHubSourceAction({
              actionName: 'Checkout',
              output: sourceOutput,
              repo: 'hamlet-user-service',
              branch: 'main',
              owner: 'kedarkolhatkar',
              oauthToken: githubToken,
            }),
          ],
        },
        {
          stageName: 'Build',
          actions: [
            new codepipelineActions.CodeBuildAction({
              actionName: 'build',
              project: cdkBuild,
              input: sourceOutput,
            }),
          ],
        },
      ],
    });
  }
}
