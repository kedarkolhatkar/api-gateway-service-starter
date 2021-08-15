import createHttpError from 'http-errors';

const getResourceName = (resource) => {
  const pathArray = resource.split('/');

  return !pathArray || !Array.isArray(pathArray) || pathArray.length < 2 ? '' : pathArray[1];
};

const validateRequest = (event) => {
  if (!event.resource || getResourceName(event.resource) !== 'users') {
    throw new createHttpError.BadRequest('Invalid resource provided: ', event.resource);
  }
};

export { validateRequest };
