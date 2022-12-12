import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmRepository } from 'src/share/database/typeorm.repository';
import { Repository } from 'typeorm';
import { RolePermissionEntity } from './entities/role-permission.entity';
import { ROLE_PERMISION_CONST } from './role-permission.constant';

@Injectable()
export class RolePermissionRepository extends TypeOrmRepository<RolePermissionEntity> {
  constructor(
    @Inject(ROLE_PERMISION_CONST.MODEL_PROVIDER)
    rolePermissionEntity: Repository<RolePermissionEntity>,
  ) {
    super(rolePermissionEntity);
  }
}
