import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../share/database/base.service';
import { PERMISSIONS } from './permission.constant';
import { PermissionEntity } from './permission.entity';

@Injectable()
export class PermissionService extends BaseService<PermissionEntity> {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {
    super(permissionRepository);
  }
  async onModuleInit() {
    for (const permission of Object.values(PERMISSIONS)) {
      const pExisted = await this.permissionRepository.findOneBy({
        name: permission,
      });
      if (!pExisted) {
        await this.permissionRepository.save({ name: permission });
      }
    }
  }

  public async getPermissions() {
    const data = await this.getAll();
    return {
      data,
    };
  }
}
