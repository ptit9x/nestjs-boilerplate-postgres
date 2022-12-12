import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmRepository } from 'src/share/database/typeorm.repository';
import { Repository } from 'typeorm';
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
