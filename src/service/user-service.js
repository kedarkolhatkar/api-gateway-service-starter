import { v4 as uuidv4 } from 'uuid';
import createHttpError from 'http-errors';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
/**
 * Return userService object that provides functionality to manager user
 * @param {*} userTableName
 * @returns userService
 */
const getUserService = (userTableName) => {
  /**
   * Gets user with userId
   * @param {} id
   * @returns user item with userId
   */
  const getUser = async (id) => {
    try {
      const client = new DynamoDBClient({ region: process.env.AWS_REGION });
      const ddbDocClient = DynamoDBDocumentClient.from(client);
      const input = {
        TableName: userTableName,
        Key: {
          userId: id,
        },
      };

      const result = await ddbDocClient.send(new GetCommand(input));
      return result.Item;
    } catch (error) {
      if (createHttpError.isHttpError(error)) throw error;
      else {
        // console.error(error);
        throw new createHttpError.InternalServerError('Error getting user from database', error);
      }
    }
  };

  /**
   * Saves user item in the DynamoDB table. User ID is generated while saving.
   * @param {} user
   * @returns user ID of saved user item
   */
  const createUser = async (user) => {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    const ddbDocClient = DynamoDBDocumentClient.from(client);

    const userId = uuidv4();

    const input = {
      TableName: userTableName,
      Item: { ...user, userId },
    };

    const command = new PutCommand(input);

    try {
      await ddbDocClient.send(command);
      return { id: userId };
    } catch (error) {
      throw new createHttpError.InternalServerError(`Error saving user in the database: ${error}`);
    }
  };

  return {
    getUser,
    createUser,
  };
};

export { getUserService };
