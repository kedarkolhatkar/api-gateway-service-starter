# Welcome to the a starter project for AWS Lambda Function using CDK for deployment

This is a starter project that includes AWS Lambda Function written using NodeJS, along with CDK code to deploy the Lambda function to an AWS account. My goal for this project is to allow anyone (including me) to have a new deployable AWS Lambda Function in 2 minutes.

## Features of the starter project

- Development Language: **NodeJS**
- Deployment: **AWS CDK**
- Lambda Bundling: **Webpack**
- Code Formatting: **Prettier**
- Local Testing: **SAM**

## Getting Started

Let's get started!

### Pre-requisites

Get your machine ready with the tools you will need for this service

- git: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
- Install Node Version Manager (optional): This is an optional step but highly recommended because in the future I am sure you will need to quickly change to different node version.
  You can use either [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm).
- Install node: https://nodejs.org/en/download/package-manager/
- Install aws cli: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
- Configure AWS CLI: `aws configure`
- Install Typescript: `npm -g install typescript`
- Install aws cdk: https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html
- Install Python3: https://opensource.com/article/19/5/python-3-default-mac
- Install and Configure Prettier App: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
  - Add following to VSCode Settings (Shortcut to open settings: cmd+shift+p and search for "Preferrences: OpenSettings(JSON))
  ```"editor.formatOnSave": true,
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "[javascript]": {
          "editor.defaultFormatter": "esbenp.prettier-vscode",
          "editor.formatOnSave": true
      }
  ```

### Download and Setup the repository

- Clone Repository: `git clone https://github.com/kedarkolhatkar/nodejs-cdk-lambda-starter.git`
- `cd nodejs-cdk-lambda-starter.git`
- `npm install`
- AWS Credentials: Ensure that you have AWS credentials setup
- `./charm`

# Local Testing using SAM Local

- Ensure that AWS SAM is installed on your machine. Here is a link for instructions to install SAM on MAC: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-mac.html
- `npm run sam-prepare` - This step is needed only once. This will synthacize a CloudFormation template using `cdk synth` and then copy the templatt to `./sam` folder.
- `npm run sam-e` - Runs lambda function locally

## Useful commands

- `npm run bundle-lambda` uses webpack to create a lambda bundlee
- `./charm deploy` - Deploy lambda to AWS.
- `npm run prettier` check code formatting using prettier
- `npm run prettier:fix` fix code formatting using prettier
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
