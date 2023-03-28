import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../configs/database/database.module';
import { PermissionsController } from './permission.controller';
import { permissionsProvider } from './permission.provider';
import { PermissionsRepository } from './permission.repository';
import { PermissionsService } from './permission.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PermissionsController],
  providers: [
    PermissionsService,
    ...permissionsProvider,
    PermissionsRepository,
  ],
  exports: [PermissionsService],
})
export class PermissionsModule {}
