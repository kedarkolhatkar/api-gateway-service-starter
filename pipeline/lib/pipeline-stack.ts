import * as cdk from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import { LogGroup } from '@aws-cdk/aws-logs';

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
    const cdkBuild = new codebuild.PipelineProject(this, `${finalProps.serviceName}-build-1`, {
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
          logGroup: LogGroup.fromLogGroupName(this, `${finalProps.serviceName}-buildlogs-id`, finalProps.projectName),
          prefix: `${finalProps.serviceName}-buildlogs`,
        },
      },
    });

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
              project: cdkBuild,
              input: sourceOutput,
            }),
          ],
        },
      ],
    });
  }
}
