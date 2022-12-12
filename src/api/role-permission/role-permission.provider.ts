import { DataSource } from 'typeorm';
import { ROLE_PERMISION_CONST } from './role-permission.constant';
import { RolePermissionEntity } from './entities/role-permission.entity';

export const rolePermissionProvider = [
  {
    provide: ROLE_PERMISION_CONST.MODEL_PROVIDER,
    useFactory: (connection: DataSource) =>
      connection.getRepository(RolePermissionEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
