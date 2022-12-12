import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmRepository } from 'src/share/database/typeorm.repository';
import { Repository } from 'typeorm';
import { PermissionEntity } from './entities/permission.entity';
import { PERMISSION_CONST } from './permissions.constant';

@Injectable()
export class PermissionsRepository extends TypeOrmRepository<PermissionEntity> {
  constructor(
    @Inject(PERMISSION_CONST.MODEL_PROVIDER)
    permissionEntity: Repository<PermissionEntity>,
  ) {
    super(permissionEntity);
  }
}
