import { DataSource } from 'typeorm';
import { ROLE_CONST } from './roles.constant';
import { RoleEntity } from './entities/role.entity';

export const rolesProvider = [
  {
    provide: ROLE_CONST.MODEL_PROVIDER,
    useFactory: (connection: DataSource) =>
      connection.getRepository(RoleEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
