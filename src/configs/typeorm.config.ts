import { DataSource } from 'typeorm';
import { DATABASE_CONFIG } from './constant.config';
import { PermissionEntity } from '../api/permission/permission.entity';
import { RoleEntity } from '../api/role/role.entity';
import { UserEntity } from '../api/user/user.entity';

export default new DataSource({
  type: 'postgres',
  host: DATABASE_CONFIG.host,
  port: DATABASE_CONFIG.port,
  username: DATABASE_CONFIG.username,
  password: DATABASE_CONFIG.password,
  database: DATABASE_CONFIG.database,
  entities: [PermissionEntity, RoleEntity, UserEntity],
  migrations: [__dirname + '/../../migrations/*.ts'],
  synchronize: false,
  logging: DATABASE_CONFIG.logging,
});
