import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { TypeOrmRepository } from 'src/share/database/typeorm.repository';
import { USER_CONST } from './user.constant';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository extends TypeOrmRepository<UserEntity> {
  constructor(
    @Inject(USER_CONST.MODEL_PROVIDER)
    userEntity: Repository<UserEntity>,
  ) {
    super(userEntity);
  }
}
