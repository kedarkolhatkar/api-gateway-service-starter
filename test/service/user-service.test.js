import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { getUserService } from '../../src/service/user-service';
import { isValidUUID } from '../utils/test-util';

const dynamoDBMock = mockClient(DynamoDBClient);
const userService = getUserService('user-table');

beforeEach(() => {
  dynamoDBMock.reset();
});

test('getUser-success', () => {
  const expectedUser = {
    userId: 1,
    firstName: 'Radha',
    lastName: 'Krishna',
  };

  expect(expectedUser).toEqual(getUserService('user-table').getUser(1));
});

test('create-user-success', async () => {
  dynamoDBMock.on(PutItemCommand).resolves({});

  const result = await userService.createUser({ firstName: 'Rahul', lastName: 'Dravid' });

  expect(result).not.toBeFalsy();
  expect(result.userId).not.toBeFalsy();
  expect(isValidUUID(result.userId)).toBe(true);
});
