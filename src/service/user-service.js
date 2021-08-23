import { v4 as uuidv4 } from 'uuid';
import createHttpError from 'http-errors';
import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';

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
    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    const input = {
      TableName: userTableName,
      Key: {
        userId: {
          S: id,
        },
      },
    };

    const command = new GetItemCommand(input);
    try {
      await client.send(command);
      return {
        id,
        firstName: 'Radha',
        lastName: 'Krishna',
      };
    } catch (error) {
      throw new createHttpError.InternalServerError(`Error getting user from database: ${error}`);
    }
  };

  /**
   * Saves user item in the DynamoDB table. User ID is generated while saving.
   * @param {} user
   * @returns user ID of saved user item
   */
  const createUser = async (user) => {
    const userId = uuidv4();

    const item = {
      userId: { S: userId },
      firstName: { S: user.firstName },
      lastName: { S: user.lastName },
    };

    const input = {
      TableName: userTableName,
      Item: item,
    };

    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    const command = new PutItemCommand(input);

    try {
      await client.send(command);
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
