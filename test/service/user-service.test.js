import { getUserService } from '../../src/service/user-service';

test('getUser-success', () => {
  const expectedUser = {
    userId: 1,
    firstName: 'Radha',
    lastName: 'Krishna',
  };

  expect(expectedUser).toEqual(getUserService('user-table').getUser(1));
});
