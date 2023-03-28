import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/share/database/base.service';
import { Repository } from 'typeorm';
import { PERMISSIONS } from './permission.constant';
import { PermissionEntity } from './permission.entity';

@Injectable()
export class PermissionsService extends BaseService<PermissionEntity> {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>
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
