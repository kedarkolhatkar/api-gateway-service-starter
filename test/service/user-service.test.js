import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { beforeEach, test, expect } from '@jest/globals';
import { getUserService } from '../../src/service/user-service';
import { isValidUUID } from '../utils/test-util';

const ddbMock = mockClient(DynamoDBClient);
const userService = getUserService('user-table');

beforeEach(() => {
  ddbMock.reset();
});

test('get-user-success', async () => {
  const expectedUser = {
    id: '1',
    firstName: 'Radha',
    lastName: 'Krishna',
  };

  ddbMock
    .on(GetItemCommand, {
      TableName: 'user-table',
      Key: {
        userId: {
          S: '1',
        },
      },
    })
    .resolves({
      Item: {
        userId: { S: '1' },
        firstName: { S: 'Radha' },
        lastName: { S: 'Krishna' },
      },
    });

  const result = await userService.getUser('1');
  ddbMock.calls();
  expect(expectedUser).toEqual(result);
});

test('create-user-success', async () => {
  ddbMock.on(PutItemCommand).resolves({});

  const result = await userService.createUser({ username: 'rdravid', firstName: 'Rahul', lastName: 'Dravid' });

  expect(result).not.toBeFalsy();
  expect(result.id).not.toBeFalsy();
  expect(isValidUUID(result.id)).toBe(true);
});
