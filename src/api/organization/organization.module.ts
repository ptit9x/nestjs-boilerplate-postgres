import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { OrganizationEntity } from './organization.entity';
import { PermissionEntity } from '../permission/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationEntity, PermissionEntity])],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
