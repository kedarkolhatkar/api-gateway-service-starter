import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { getUserService } from '../service/user-service';

const getResourceFromPath = (path) => {
  const pathArray = path.split('/');
  return pathArray[1];
};

const validateResource = (resource) => {
  if (resource !== 'user') {
    throw new Error('Invalide resource provide: ', resource);
  }
};

const baseHandler = async (event) => {
  // console.log(`baseHandler event: ${JSON.stringify(event)}`);

  const resource = getResourceFromPath(event.path);
  validateResource(resource);
  const userService = getUserService(process.env.USER_TABLE_NAME);

  let result = {};

  const pathArray = event.path.split('/');

  switch (event.httpMethod) {
    case 'GET':
      result = await userService.getUser(pathArray[2]);
      break;
    case 'PUT':
      result = await userService.createUser(event.body);
      break;
    default:
      throw new Error('Invalid httpMethod in the event: ', event.httpMethod);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};

const handler = middy(baseHandler).use(jsonBodyParser()).use(httpErrorHandler());

export { handler };
