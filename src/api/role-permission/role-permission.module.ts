import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../configs/database/database.module';
import { rolePermissionProvider } from './role-permission.provider';
import { RolePermissionRepository } from './role-permission.repository';
import { RolesPermissionService } from './role-permission.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    RolesPermissionService,
    RolePermissionRepository,
    ...rolePermissionProvider,
  ],
  exports: [RolesPermissionService],
})
export class RolePermissionModule {}
