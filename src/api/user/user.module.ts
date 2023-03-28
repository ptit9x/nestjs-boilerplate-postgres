import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { DatabaseModule } from '../../configs/database/database.module';
import { userProvider } from './user.provider';
import { UserController } from './user.controller';
import { RolesModule } from '../role/role.module';

@Module({
  imports: [DatabaseModule, RolesModule],
  providers: [UserService, UserRepository, ...userProvider],
  exports: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
