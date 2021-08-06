async function waitFor() {
  console.log('waitFor called');
  return Promise.resolve('success');
}

const handler = async (event) => {
  console.log('Lambda function called');
  console.log(`event: ${JSON.stringify(event)}`);
  await waitFor();
  console.log('executing after waitFor');
};

export { handler };
