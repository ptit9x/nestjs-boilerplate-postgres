import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../configs/database/database.module';
import { permissionsProvider } from './permissions.provider';
import { PermissionsRepository } from './permissions.repository';
import { PermissionsService } from './permissions.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [
    PermissionsService,
    ...permissionsProvider,
    PermissionsRepository,
  ],
  exports: [PermissionsService],
})
export class PermissionsModule {}
