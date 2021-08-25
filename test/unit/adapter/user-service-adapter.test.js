import { expect, describe, test } from '@jest/globals';
import { adaptCreateUserRequest } from '../../../src/adapter/user-service-adapter';

describe('user-service-adapter tests ', () => {
  describe('adaptCreateUserRequest tests', () => {
    test('adaptCreateUserRequest throws error when requestBody cannot be parsed', () => {
      expect(() => {
        adaptCreateUserRequest('{\n    "firstName"');
      }).toThrowError('requestBody cannot be parsed');
    });

    test('throws validation error required attributes are not passsed', () => {
      expect(() => {
        adaptCreateUserRequest('');
      }).toThrowError('requestBody cannot be parsed');
    });
  });
});
