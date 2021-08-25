import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { describe, beforeEach, test, expect } from '@jest/globals';
import { getUserService } from '../../../src/service/user-service';
import { isValidUUID } from '../../utils/test-util';

describe('user-service tests', () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);
  const userService = getUserService('user-table', ddbMock);

  beforeEach(() => {
    ddbMock.reset();
  });

  describe('getUser tests', () => {
    test('returns user successfully', async () => {
      const expectedUser = {
        id: '1',
        username: 'astark',
        firstName: 'Arya',
        lastName: 'Stark',
      };

      ddbMock
        .on(GetCommand, {
          TableName: 'user-table',
          Key: {
            userId: '1',
          },
        })
        .resolves({
          Item: {
            id: '1',
            username: 'astark',
            firstName: 'Arya',
            lastName: 'Stark',
          },
        });

      const result = await userService.getUser('1');
      ddbMock.calls();
      expect(result).toEqual(expectedUser);
    });
  });

  describe('createUser tests', () => {
    test('create-user-success', async () => {
      const user = { username: 'rdravid', firstName: 'Rahul', lastName: 'Dravid' };
      ddbMock.on(PutCommand).resolves({});

      const result = await userService.createUser(user);

      ddbMock.calls();
      expect(result).not.toBeFalsy();
      expect(result.id).not.toBeFalsy();
      expect(isValidUUID(result.id)).toBe(true);
    });
  });
});
