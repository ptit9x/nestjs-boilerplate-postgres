import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../configs/database/database.module';
import { PermissionsController } from './permissions.controller';
import { permissionsProvider } from './permissions.provider';
import { PermissionsRepository } from './permissions.repository';
import { PermissionsService } from './permissions.service';

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
