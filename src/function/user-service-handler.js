import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import createHttpError from 'http-errors';
import { getUserService } from '../service/user-service';

const validate = (event) => {
  if (!event.resource || event.resource !== '/users') {
    throw new createHttpError.BadRequest('Invalid resource provided: ', resource);
  }
};

const baseHandler = async (event) => {
  console.log(`baseHandler event: ${JSON.stringify(event)}`);

  validate(event);
  const userService = getUserService(process.env.USER_TABLE_NAME);
  // const userService = getUserService('test');

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

const handler = middy(baseHandler).use(httpErrorHandler());

export { handler };
