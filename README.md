# Welcome to the a starter project for AWS Lambda Function using CDK for deployment

This is a starter project that includes AWS Lambda Function written using NodeJS, along with CDK code to deploy the Lambda function to an AWS account. My goal for this project is to allow anyone (including me) to have a new deployable AWS Lambda Function in 2 minutes.
## Features of the starter project
- Development Language: **NodeJS**
- Deployment: **AWS CDK**
- Lambda Bundling: **Webpack**
- Code Formatting: **Prettier**
- Local Testing: **SAM**

## Getting Started
- Clone Repository: `git clone https://github.com/kedarkolhatkar/nodejs-cdk-lambda-starter.git`
- `cd nodejs-cdk-lambda-starter.git`
- `npm install`
- AWS Credentials: Ensure that you have AWS credentials setup
- `./deployCDK.sh`

# Local Testing using SAM Local
- Ensure that AWS SAM is installed on your machine. Here is a link for instructions to install SAM on MAC: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-mac.html
- `npm run sam-prepare` - This step is needed only once. This will synthacize a CloudFormation template using `cdk synth` and then copy the templatt to `./sam` folder. 
- `npm run sam-e` - Runs lambda function locally

## Useful commands

- `npm run bundle-lambda` uses webpack to create a lambda bundlee
- `./deployCDK.sh` - Deploy lambda to AWS.
- `npm run prettier` check code formatting using prettier
- `npm run prettier:fix` fix code formatting using prettier
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
