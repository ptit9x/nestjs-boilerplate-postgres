import { DataSource } from 'typeorm';
import { DATABASE_CONFIG } from './constant.config';

import { PermissionEntity } from '../api/permissions/entities/permission.entity';
import { RoleEntity } from '../api/roles/entities/role.entity';
import { UserEntity } from '../api/user/user.entity';
import { RolePermissionEntity } from '../api/role-permission/entities/role-permission.entity';

import { CreatePermissions1661154835736 } from '../../migrations/1661154835736-CreatePermissions';
import { CreateRoles1661161731016 } from '../../migrations/1661161731016-CreateRoles';
import { CreateUser1661224228702 } from '../../migrations/1661224228702-CreateUser';

export default new DataSource({
  type: 'postgres',
  host: DATABASE_CONFIG.host,
  port: DATABASE_CONFIG.port,
  username: DATABASE_CONFIG.username,
  password: DATABASE_CONFIG.password,
  database: DATABASE_CONFIG.database,
  entities: [PermissionEntity, RoleEntity, RolePermissionEntity, UserEntity],
  migrations: [
    CreatePermissions1661154835736,
    CreateRoles1661161731016,
    CreateUser1661224228702,
  ],
  synchronize: true,
  logging: DATABASE_CONFIG.logging,
});
