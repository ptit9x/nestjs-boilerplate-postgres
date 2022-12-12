import { swaggerSchemaExample } from '../../share/utils/swagger_schema';

export const ERROR_AUTH = {
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

export const AUTH_SWAGGER_RESPONSE = {
  LOGIN_SUCCESS: swaggerSchemaExample(
    {
      data: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        accessTokenExpire: 86400,
        isFirstTimeLogin: true,
      },
      statusCode: 200,
    },
    'login success',
  ),
  LOGIN_FAIL: swaggerSchemaExample(
    {
      message: 'User not found, disabled or locked',
      code: 'sys00001',
      statusCode: 404,
    },
    'User not found',
  ),
  BAD_REQUEST_EXCEPTION: swaggerSchemaExample(
    {
      message: 'bad exception',
      code: 'sys00001',
      statusCode: 400,
    },
    'bad request exception',
  ),
  UNAUTHORIZED_EXCEPTION: swaggerSchemaExample(
    {
      message: 'Unauthorized',
      code: 'sys00001',
      statusCode: 401,
    },
    'Unauthorized exception, you need to login again',
  ),
  NOT_FOUND_EXCEPTION: swaggerSchemaExample(
    {
      message: 'not found exception',
      code: 'sys00001',
      statusCode: 404,
    },
    'not found exception',
  ),
  INTERNAL_SERVER_EXCEPTION: swaggerSchemaExample(
    {
      message: 'internal server error',
      code: 'sys00001',
      statusCode: 500,
    },
    'internal server error',
  ),
};

