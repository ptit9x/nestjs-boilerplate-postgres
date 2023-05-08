import { IUserPayload } from 'src/share/common/app.interface';
import { swaggerSchemaExample } from '../../share/utils/swagger_schema';

export const USER_CONST = {
  MODEL_NAME: 'user',
};

export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export const ERROR_USER = {
  USER_NOT_FOUND: {
    CODE: 'us00001',
    MESSAGE: 'This email does not exist in our records',
  },
  PASSWORD_INCORRECT: {
    CODE: 'us00002',
    MESSAGE: 'That’s an incorrect password. Please try again.',
  },
  USER_INACTIVE: {
    CODE: 'us00003',
    MESSAGE:
      'This account has been deactivated. Please contact the organization admin to reactivate your account.',
  },
  USER_EXISTED: {
    CODE: 'us00004',
    MESSAGE: 'User existed!',
  },
  USER_WRONG_OLD_PASSWORD: {
    code: 'us00005',
    MESSAGE: 'Password does not match',
  },
  USER_NAME_EXISTED: {
    CODE: 'us00006',
    MESSAGE: 'This username already exists. Please input a new username',
  },
  USER_PHONE_EXISTED: {
    CODE: 'us00007',
    MESSAGE:
      'This phone number already exists. Please input a different phone number',
  },
};

export const MOCK_USER: IUserPayload = {
  id: '1',
  createdAt: '2023-02-24T01:01:18.077Z',
  updatedAt: '2023-03-01T21:29:20.257Z',
  name: 'Richard Do',
  email: 'huynhdn@gmail.com',
  status: 1,
  createdBy: null,
  phone: null,
  lastLogin: '2023-03-02T04:29:20.000Z',
};
export const MOCK_USER_WITH_ROLE: IUserPayload = {
  ...MOCK_USER,
  roles: [
    {
      id: 1,
      name: 'Administrator',
      type: 1,
      permissions: [
        {
          id: 1,
          name: 'user:create',
        },
        {
          id: 2,
          name: 'user:read',
        },
        {
          id: 3,
          name: 'user:update',
        },
        {
          id: 4,
          name: 'user:delete',
        },
        {
          id: 5,
          name: 'role:create',
        },
        {
          id: 6,
          name: 'role:read',
        },
        {
          id: 7,
          name: 'role:update',
        },
        {
          id: 8,
          name: 'role:delete',
        },
        {
          id: 9,
          name: 'permission:read',
        },
      ],
    },
  ],
};

export const USER_SWAGGER_RESPONSE = {
  GET_LIST_SUCCESS: swaggerSchemaExample(
    {
      data: [MOCK_USER],
      total: 1,
      page: 1,
      pageSize: 20,
      totalPage: 1,
    },
    'List success',
  ),
  UPDATE_SUCCESS: swaggerSchemaExample('', 'Update success'),
  GET_SUCCESS: swaggerSchemaExample(MOCK_USER_WITH_ROLE, 'Get success'),
};
