import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { getUserService } from '../../service/user-service';

const serviceDependencyInjector = () => {
  const middlwareBefore = async (request) => {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    const ddbDocClient = DynamoDBDocumentClient.from(client);

    const userService = getUserService(process.env.USER_TABLE_NAME, ddbDocClient);

    request.context.userService = userService;
  };

  return {
    before: middlwareBefore,
  };
};

export { serviceDependencyInjector };
