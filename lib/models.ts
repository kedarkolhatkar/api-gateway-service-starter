import { RestApi, JsonSchemaType, Model, RequestValidator } from '@aws-cdk/aws-apigateway';

export interface UserServiceModels {
  createUserRequestModel: Model;
  createUserSuccessResponseModel: Model;
  internalErrorResponseModel: Model;
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

    const createUserSuccessResponseModel = this.restApi.addModel('create-user-response-model-id', {
      modelName: 'createUserSuccessResponseModel',
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

    const internalErrorResponseModel = this.restApi.addModel('inter-error-response-model-id', {
      modelName: 'internalErrorResponseModel',
      schema: {
        type: JsonSchemaType.OBJECT,
        properties: {
          errorCode: {
            type: JsonSchemaType.STRING,
          },
          message: {
            type: JsonSchemaType.STRING,
          },
        },
      },
    });

    return {
      createUserRequestModel,
      createUserSuccessResponseModel,
      internalErrorResponseModel,
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
