import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmRepository } from '../../share/database/typeorm.repository';
import { Repository } from 'typeorm';
import { PermissionEntity } from './permission.entity';
import { PERMISSION_CONST } from './permission.constant';

@Injectable()
export class PermissionsRepository extends TypeOrmRepository<PermissionEntity> {
  constructor(
    @Inject(PERMISSION_CONST.MODEL_PROVIDER)
    permissionEntity: Repository<PermissionEntity>,
  ) {
    super(permissionEntity);
  }
}
