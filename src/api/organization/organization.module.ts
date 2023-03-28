import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { OrganizationRepository } from './organization.repository';
import { DatabaseModule } from '../../configs/database/database.module';
import { organizationProvider } from './organization.provider';
import { PermissionsModule } from '../permission/permission.module';

@Module({
  imports: [DatabaseModule, PermissionsModule],
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    OrganizationRepository,
    ...organizationProvider,
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}
