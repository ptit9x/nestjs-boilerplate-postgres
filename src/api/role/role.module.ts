import { Module } from '@nestjs/common';

import { RolesService } from './role.service';
import { RolesController } from './role.controller';
import { DatabaseModule } from '../../configs/database/database.module';
import { RolesRepository } from './role.repository';
import { rolesProvider } from './role.provider';
import { PermissionsModule } from '../permission/permission.module';

@Module({
  imports: [DatabaseModule, PermissionsModule],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository, ...rolesProvider],
  exports: [RolesService],
})
export class RolesModule {}
