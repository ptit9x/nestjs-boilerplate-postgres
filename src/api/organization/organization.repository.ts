import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmRepository } from '../../share/database/typeorm.repository';
import { Repository } from 'typeorm';
import { ENTITY_CONST } from './organization.constant';
import { OrganizationEntity } from './organization.entity';

@Injectable()
export class OrganizationRepository extends TypeOrmRepository<OrganizationEntity> {
  constructor(
    @Inject(ENTITY_CONST.MODEL_PROVIDER)
    entity: Repository<OrganizationEntity>,
  ) {
    super(entity);
  }
}
