import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmRepository } from '../../share/database/typeorm.repository';
import { ENTITY_CONST } from './entity.constant';
import { EntityEntity } from './entity.entity';

@Injectable()
export class EntityRepository extends TypeOrmRepository<EntityEntity> {
  constructor(
    @Inject(ENTITY_CONST.MODEL_PROVIDER)
    portfolioEntity: Repository<EntityEntity>,
  ) {
    super(portfolioEntity);
  }
}
