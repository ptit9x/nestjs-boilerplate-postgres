import { DataSource } from 'typeorm';
import { PERMISSION_CONST } from './permissions.constant';
import { PermissionEntity } from './entities/permission.entity';

export const permissionsProvider = [
  {
    provide: PERMISSION_CONST.MODEL_PROVIDER,
    useFactory: (connection: DataSource) =>
      connection.getRepository(PermissionEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
