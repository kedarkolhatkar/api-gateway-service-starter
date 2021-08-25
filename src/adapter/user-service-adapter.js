const adaptCreateUserRequest = (requestBody) => {
  let parsedBody = {};
  try {
    parsedBody = JSON.parse(requestBody);
    // console.log(`parsedBody=${JSON.parse(parsedBody)}`);
    return parsedBody;
  } catch (error) {
    throw new Error('requestBody cannot be parsed');
  }
};

export { adaptCreateUserRequest };
