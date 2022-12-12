import { Module } from '@nestjs/common';

import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { DatabaseModule } from 'src/configs/database/database.module';
import { RolesRepository } from './roles.repository';
import { rolesProvider } from './roles.provider';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';

@Module({
  imports: [DatabaseModule, PermissionsModule, RolePermissionModule],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository, ...rolesProvider],
  exports: [RolesService],
})
export class RolesModule {}
