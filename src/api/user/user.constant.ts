import { swaggerSchemaExample } from '../../share/utils/swagger_schema';

export const USER_CONST = {
  MODEL_NAME: 'user',
  MODEL_PROVIDER: 'USER_MODEL',
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

export const USER_SWAGGER_RESPONSE = {
  GET_LIST_SUCCESS: swaggerSchemaExample(
    {
      data: {
        id: '1',
        created_at: '2022-08-23T02:21:16.992Z',
        updated_at: '2022-08-23T02:21:16.992Z',
        deleted_at: null,
        name: 'Administrator',
        email: 'bach.nguyen@vmodev.com',
        type: 1,
        is_administrator: true,
        status: 1,
        created_by: null,
        country: null,
        city: null,
        postal_code: null,
        phone: null,
        expired_date: null,
      },
    },
    'Create success',
  ),

  UPDATE_SUCCESS: swaggerSchemaExample(
    {
      data: {
        success: true,
      },
    },
    'Update success',
  ),
};
