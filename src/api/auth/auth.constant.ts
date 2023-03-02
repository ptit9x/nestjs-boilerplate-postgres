import { swaggerSchemaExample } from '../../share/utils/swagger_schema';

export const ERROR_AUTH = {
  USER_NOT_FOUND: {
    CODE: 'us00001',
    MESSAGE: 'Username or password is invalid!',
  },
  PASSWORD_INCORRECT: {
    CODE: 'us00002',
    MESSAGE: 'Username or password is invalid!',
  },
  USER_DEACTIVE: {
    CODE: 'us00003',
    MESSAGE:
      'This account has been deactivated. Please contact the organization admin to reactivate your account.',
  },
  USER_LOCKED: {
    CODE: 'us00004',
    MESSAGE:
      'Your account has been locked. Please contact the Admin to activate your account again!',
  },
  USER_WRONG_OLD_PASSWORD: {
    code: 'us00005',
    MESSAGE: 'Password does not match',
  },
  USER_NAME_EXISTED: {
    CODE: 'us00006',
    MESSAGE: 'This username already exists. Please input a new username',
  },
  USER_LOCKED_30_MIN: {
    CODE: 'us00007',
    MESSAGE: 'Your account has been locked. Please try again after 30 minutes!',
  },
};

export const WRONG_NUMBER_OF_LOGIN = {
  FIRST_TIME: 10,
  SECOND_TIME: 20,
  THIRD_TIME: 30,
};
export const ACTIVE_USER_AFTER_LOCK = 30; // 30 min

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
