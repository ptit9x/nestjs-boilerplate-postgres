import { Injectable, OnModuleInit } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PERMISSIONS } from './permissions.constant';
import { PermissionsRepository } from './permissions.repository';

@Injectable()
export class PermissionsService implements OnModuleInit {
  constructor(private readonly permissionsRepository: PermissionsRepository) {}
  async onModuleInit() {
    for (const permission of Object.values(PERMISSIONS)) {
      const pExisted = await this.permissionsRepository.repository.findOneBy({
        name: permission,
      });
      if (!pExisted) {
        await this.permissionsRepository.save({ name: permission });
      }
    }
  }

  public async findOneByConditions(conditions: FindOneOptions) {
    return this.permissionsRepository.findOneByCondition(conditions);
  }

  public find(conditions: FindManyOptions) {
    return this.permissionsRepository.repository.find(conditions);
  }

  public async getPermissions() {
    const data = await this.permissionsRepository.repository.find({});
    return {
      data,
    };
  }
}
