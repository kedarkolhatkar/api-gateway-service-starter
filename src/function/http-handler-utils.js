import createHttpError from 'http-errors';

// Supported Resources
const RESOURCE_USERS = 'users';

const getResourceName = (resource) => {
  const pathArray = resource.split('/');

  return !pathArray || !Array.isArray(pathArray) || pathArray.length < 2 ? '' : pathArray[1];
};

const validateRequest = (event) => {
  if (!event.resource || getResourceName(event.resource) !== RESOURCE_USERS) {
    throw new createHttpError.BadRequest('Resource not supported: ', event.resource);
  }
};

export { validateRequest };
