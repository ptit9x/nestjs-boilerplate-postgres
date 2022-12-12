import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { DatabaseModule } from 'src/configs/database/database.module';
import { userProvider } from './user.provider';
import { UserController } from './user.controller';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, UserRepository, ...userProvider],
  exports: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
