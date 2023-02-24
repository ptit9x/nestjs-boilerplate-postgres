import { Module } from '@nestjs/common';

import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { DatabaseModule } from '../../configs/database/database.module';
import { RolesRepository } from './roles.repository';
import { rolesProvider } from './roles.provider';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [DatabaseModule, PermissionsModule],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository, ...rolesProvider],
  exports: [RolesService],
})
export class RolesModule {}
