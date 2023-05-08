import { swaggerSchemaExample } from '../../share/utils/swagger_schema';
import { PERMISSIONS } from '../permission/permission.constant';
import { RoleTypes } from '../role/role.constant';

export const ENTITY_CONST = {
  MODEL_NAME: 'organization',
  MODEL_PROVIDER: 'ORGANIZATION_MODEL',
};

export const ERROR_ORGANIZATION = {
  EXIST: 'This organization name already exists!',
  NOT_FOUND: 'No organization found',
  NOT_FOUND_IN_USERNAME: 'No valid organization found with username',
  CANNOT_DELETE_FOUNDATION_ORGANIZATION:
    'Cannot delete foundation organization',
  HAVING_INCOMING_ORDER:
    'Fail to delete this organization cause of incoming order',
};

export const DEFAULT_ORGANIZATION = {
  id: 1,
  name: 'Organization default',
};

export const ROLES_ORGANIZATION_DEFAULT = [
  {
    name: 'Organization Manager',
    permissions: Object.values([
      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_EDIT,
      PERMISSIONS.USER_DELETE,
    ]),
    type: RoleTypes.Admin,
  },
  {
    name: 'Organization User',
    permissions: [PERMISSIONS.USER_READ],
    type: RoleTypes.User,
  },
];

export const MOCK_ORG = {
  id: '1',
  createdAt: '2022-12-21T03:49:53.770Z',
  updatedAt: '2022-12-21T03:49:53.770Z',
  organizationName: "huynhdn's organization",
  address: 'FLC 36 Phamj Hùng, HN, Việt Nam',
  logoUrl:
    'https://d33wubrfki0l68.cloudfront.net/e937e774cbbe23635999615ad5d7732decad182a/26072/logo-small.ede75a6b.svg',
  contact: '+84374539633',
};

export const SWAGGER_RESPONSE = {
  SEARCH_SUCCESS: swaggerSchemaExample(
    {
      data: [MOCK_ORG],
      total: 1,
      page: 1,
      pageSize: 100,
      totalPage: 1,
    },
    'list organization',
  ),
  CREATED_SUCCESS: swaggerSchemaExample(
    {
      organizationName: "huynhdn's organization",
      address: 'FLC 36 Phamj Hùng, HN, Việt Nam',
      contact: '+84374539633',
      logoUrl:
        'https://d33wubrfki0l68.cloudfront.net/e937e774cbbe23635999615ad5d7732decad182a/26072/logo-small.ede75a6b.svg',
      organization: {},
      deletedAt: null,
      id: '1',
      createdAt: '2022-12-21T03:49:53.770Z',
      updatedAt: '2022-12-21T03:49:53.770Z',
    },
    'create organization',
  ),
  UPDATE_SUCCESS: swaggerSchemaExample(true, 'update organization'),
  VIEW_DETAIL_SUCCESS: swaggerSchemaExample(
    {
      id: '2',
      createdAt: '2022-12-26T04:15:55.176Z',
      updatedAt: '2022-12-26T08:37:01.609Z',
      organizationName: 'string99',
      address: 'Ha Noi, Viet Name',
      logoUrl:
        'https://d33wubrfki0l68.cloudfront.net/e937e774cbbe23635999615ad5d7732decad182a/26072/logo-small.ede75a6b.svg',
      contact: '+84374539633',
      numberOfWarehouse: 0,
      numberOfProduct: 0,
      numberOfUser: 0,
    },
    'view detail success',
  ),
  LIST_ROLE_BY_ORGANIZATION: swaggerSchemaExample(
    {
      data: [
        {
          id: 2,
          name: 'Client Admin',
        },
        {
          id: 3,
          name: 'Client Staff',
        },
      ],
    },
    'list roles in the select box when create/edit organization',
  ),
  LIST_WAREHOUSE_BY_USER: swaggerSchemaExample(
    {
      data: [
        {
          id: '1',
          identityCode: '002',
          address: 'Thanh Xuan, HN',
        },
      ],
    },
    'list warehouse by organization success',
  ),
};
