import { Injectable, OnModuleInit } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { PERMISSIONS } from './permissions.constant';
import { PermissionsRepository } from './permissions.repository';

@Injectable()
export class PermissionsService implements OnModuleInit {
  constructor(private readonly permissionsRepository: PermissionsRepository) {}
  async onModuleInit() {
    Object.values(PERMISSIONS).forEach(async (permission) => {
      const permissionExisted =
        await this.permissionsRepository.findOneByCondition({
          where: {
            name: permission,
          },
        });
      if (!permissionExisted) {
        await this.permissionsRepository.save({
          name: permission,
        });
      }
    });
  }

  public async findOneByConditions(conditions: FindOneOptions) {
    return this.permissionsRepository.findOneByCondition(conditions);
  }
}
