import { v4 as uuidv4 } from 'uuid';
import createHttpError from 'http-errors';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

/**
 * Return userService object that provides functionality to manager user
 * @param {*} userTableName
 * @returns userService
 */
const getUserService = (userTableName, ddbDocClient) => {
  /**
   * Gets user with userId
   * @param {string} id Id of the user to get
   * @returns user entity with userId=id
   */
  const getUser = async (id) => {
    try {
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
        throw new createHttpError.InternalServerError('Error getting user from database', error);
      }
    }
  };

  /**
   * Saves user item in the DynamoDB table. User ID is generated while saving.
   * @param {object} user user entity to create
   * @returns Id of the saved user entity
   */
  const createUser = async (user) => {
    try {
      const userId = uuidv4();

      const input = {
        TableName: userTableName,
        Item: { ...user, userId },
      };

      const command = new PutCommand(input);

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
