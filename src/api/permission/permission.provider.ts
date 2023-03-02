import { DataSource } from 'typeorm';
import { PERMISSION_CONST } from './permission.constant';
import { PermissionEntity } from './permission.entity';

export const permissionsProvider = [
  {
    provide: PERMISSION_CONST.MODEL_PROVIDER,
    useFactory: (connection: DataSource) =>
      connection.getRepository(PermissionEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
