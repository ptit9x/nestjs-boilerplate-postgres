import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmRepository } from 'src/share/database/typeorm.repository';
import { Repository } from 'typeorm';
import { RoleEntity } from './role.entity';
import { ROLE_CONST } from './roles.constant';

@Injectable()
export class RolesRepository extends TypeOrmRepository<RoleEntity> {
  constructor(
    @Inject(ROLE_CONST.MODEL_PROVIDER)
    roleEntity: Repository<RoleEntity>,
  ) {
    super(roleEntity);
  }
}
