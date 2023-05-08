import { swaggerSchemaExample } from '../../share/utils/swagger_schema';
import { PERMISSIONS } from '../permission/permission.constant';

export const ROLE_CONST = {
  MODEL_NAME: 'role',
  MODEL_ROLE_COMPANY_NAME: 'company_role',
  MODEL_PROVIDER: 'ROLE_MODEL',
  MODEL_ROLE_COMPANY_PROVIDER: 'ROLE_COMPANY_MODEL',
};

export enum RoleTypes {
  Admin = 1,
  User = 2,
}

export enum RoleStatus {
  ACTIVE = 1,
  INACTIVE = 2,
}

export const ROLES_DEFAULT = [
  {
    name: 'Administrator',
    permissions: [PERMISSIONS.ALL],
    isSuperAdmin: true,
    type: RoleTypes.Admin,
  },
  {
    name: 'User Manager',
    permissions: Object.values([
      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_EDIT,
      PERMISSIONS.USER_DELETE,
    ]),
    type: RoleTypes.Admin,
  },
  {
    name: 'User',
    permissions: [PERMISSIONS.USER_READ],
    type: RoleTypes.User,
  },
];

export const MOCK_DATA = {
  id: '1',
  name: 'BO Admin',
};

export const ROLE_SWAGGER_RESPONSE = {
  GET_ADMIN_ROLE_SUCCESS: swaggerSchemaExample(
    {
      data: [
        {
          id: '1',
          name: 'BO Admin',
        },
        {
          id: '2',
          name: 'BO Accounting',
        },
        {
          id: '4',
          name: 'BO Sales',
        },
        {
          id: '5',
          name: 'BO Manager',
        },
      ],
    },
    'Get success',
  ),
};
