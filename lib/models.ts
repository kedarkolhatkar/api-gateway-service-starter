import { RestApi, JsonSchemaType, Model, RequestValidator } from '@aws-cdk/aws-apigateway';

export interface UserServiceModels {
  createUserRequestModel: Model;
  createUserResponseModel: Model;
}

export interface UserServiceValidators {
  bodyOnlyValidator: RequestValidator;
}

export class ModelBuilder {
  private restApi: RestApi;

  constructor(restApi: RestApi) {
    this.restApi = restApi;
  }

  buildModels(): UserServiceModels {
    const createUserRequestModel = this.restApi.addModel('create-user-request-model-id', {
      modelName: 'createUserRequestModel',
      schema: {
        type: JsonSchemaType.OBJECT,
        properties: {
          username: {
            type: JsonSchemaType.STRING,
          },
          firstName: {
            type: JsonSchemaType.STRING,
          },
          lastName: {
            type: JsonSchemaType.STRING,
          },
        },
        required: ['username', 'firstName', 'lastName'],
      },
      contentType: 'application/json',
      description: 'Model for request object for createUser API method',
    });

    const createUserResponseModel = this.restApi.addModel('create-user-response-model-id', {
      modelName: 'createUserResponseModel',
      schema: {
        type: JsonSchemaType.OBJECT,
        properties: {
          id: {
            type: JsonSchemaType.STRING,
          },
        },
        required: ['id'],
      },
      contentType: 'application/json',
      description: 'Model for response object for createUser API method',
    });

    return {
      createUserRequestModel,
      createUserResponseModel,
    };
  }

  buildValidators(): UserServiceValidators {
    const bodyOnlyValidator = this.restApi.addRequestValidator('bodyOnlyRequestValidator', {
      requestValidatorName: 'bodyOnlyValidator',
      validateRequestBody: true,
      validateRequestParameters: false,
    });

    return {
      bodyOnlyValidator,
    };
  }
}
