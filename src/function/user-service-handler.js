
const handler = async (event) => {
  console.log('Lambda function called');
  console.log(`event: ${JSON.stringify(event)}`);

  const user = {
    userId: '1',
    firstName: 'Radha',
    lastName: 'Krishna'
  };

  const response = {
    statusCode: 200,
    body: JSON.stringify(user)
  }

  return response;
};

export { handler };
