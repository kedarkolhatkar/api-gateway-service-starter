import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { beforeEach, test, expect } from '@jest/globals';
import { getUserService } from '../../src/service/user-service';
import { isValidUUID } from '../utils/test-util';

const dynamoDBMock = mockClient(DynamoDBClient);
const userService = getUserService('user-table');

beforeEach(() => {
  dynamoDBMock.reset();
});

test('get-user-success', async () => {
  const expectedUser = {
    id: '1',
    firstName: 'Radha',
    lastName: 'Krishna',
  };

  dynamoDBMock.on(GetItemCommand).resolves(expectedUser);
  const result = await userService.getUser('1');
  expect(expectedUser).toEqual(result);
});

test('create-user-success', async () => {
  dynamoDBMock.on(PutItemCommand).resolves({});

  const result = await userService.createUser({ username: 'rdravid', firstName: 'Rahul', lastName: 'Dravid' });

  expect(result).not.toBeFalsy();
  expect(result.id).not.toBeFalsy();
  expect(isValidUUID(result.id)).toBe(true);
});
