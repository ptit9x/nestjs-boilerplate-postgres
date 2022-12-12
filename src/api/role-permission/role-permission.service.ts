import { Injectable } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { RolePermissionEntity } from './entities/role-permission.entity';
import { IRolePermisson } from './role-permission.interface';
import { RolePermissionRepository } from './role-permission.repository';

@Injectable()
export class RolesPermissionService {
  constructor(
    private readonly rolePermissionRepossitory: RolePermissionRepository,
  ) {}

  findOneByCondition(
    conditions: FindOneOptions,
  ): Promise<RolePermissionEntity> {
    return this.rolePermissionRepossitory.findOneByCondition(conditions);
  }

  create(rolePermission: IRolePermisson) {
    return this.rolePermissionRepossitory.save(rolePermission);
  }
}
