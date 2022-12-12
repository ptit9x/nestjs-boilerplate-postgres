import { Module } from '@nestjs/common';

import { EntityService } from './entity.service';
import { EntityController } from './entity.controller';
import { EntityRepository } from './entity.repository';
import { DatabaseModule } from 'src/configs/database/database.module';
import { entityProvider } from './entity.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [EntityController],
  providers: [EntityService, EntityRepository, ...entityProvider],
  exports: [EntityService],
})
export class EntityModule {}
