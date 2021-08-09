import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { getUser } from '../service/user-service';

const getResourceFromPath = (path) => {
  const pathArray = path.split('/');
  console.log(pathArray);
  return pathArray[1];
};

const handleUserRequest = (path, httpMethod) => {
  const pathArray = path.split('/');

  switch (httpMethod) {
    case 'GET':
      return getUser(pathArray[2]);
    default:
      throw new Error('Invalid httpMethod in the event: ', httpMethod);
  }
};

const baseHandler = async (event) => {
  // console.log('Lambda function called');
  // console.log(`event: ${JSON.stringify(event)}`);
  // console.log('httpMethod: ', event.httpMethod);
  // console.log('path: ', event.path);
  // console.log('pathParameters: ', event.pathParameters);
  // console.log('queryStringParameters: ', event.queryStringParameters);

  const resource = getResourceFromPath(event.path);

  let result = {};
  switch (resource) {
    case 'user':
      result = handleUserRequest(event.path, event.httpMethod);
      break;
    default:
      throw new Error('Unsupported resource: ', resource);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};

const handler = middy(baseHandler).use(jsonBodyParser()).use(httpErrorHandler());

export { handler };
