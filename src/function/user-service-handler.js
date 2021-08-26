import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import createHttpError from 'http-errors';
import { validateRequest } from './http-handler-utils';
import { serviceDependencyInjector } from './middleware/service-dependecy-injector';

/**
 * This is the base handler function which processes the event.
 * @async
 * @param {*} event Lambda event object that includes requestParameters, pathParameters etc.
 * @param {*} context Lambda cotext object
 * @returns Response which the result of the operation
 */
const baseHandler = async (event, context) => {
  console.log(`baseHandler event: ${JSON.stringify(event)}`);

  validateRequest(event);
  const { userService } = context;
  let result = {};

  // TODO: We need to build path router
  switch (event.httpMethod.toUpperCase()) {
    case 'GET':
      result = await userService.getUser(event.pathParameters.user);
      break;
    case 'PUT':
      result = await userService.createUser(JSON.parse(event.body));
      break;
    default:
      throw createHttpError.MethodNotAllowed('Invalid httpMethod in the event: ', event.httpMethod);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};

const handler = middy(baseHandler).use(serviceDependencyInjector()).use(httpErrorHandler());

export { handler };
