import { Injectable, OnModuleInit } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { RolesPermissionService } from '../role-permission/role-permission.service';
import { ROLES_DEFAULT, RoleTypes } from './roles.constant';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    private readonly rolesRepossitory: RolesRepository,
    private readonly permissionService: PermissionsService,
    private readonly rolePermissionService: RolesPermissionService,
  ) {}

  async onModuleInit() {
    const rolesListExisted = await this.rolesRepossitory.findExistedRecord();
    if (rolesListExisted.length) return;

    ROLES_DEFAULT.forEach(async (role) => {
      const roleExisted = await this.rolesRepossitory.findOneByCondition({
        where: { name: role.name },
      });
      if (!roleExisted) {
        const roleCreated = await this.rolesRepossitory.save({
          name: role.name,
          type: role.type,
        });

        role.permissions.forEach(async (permissionName) => {
          const permissionFound =
            await this.permissionService.findOneByConditions({
              where: {
                name: permissionName,
              },
            });
          if (permissionFound) {
            this.rolePermissionService.create({
              permission_id: permissionFound.id,
              role_id: roleCreated.id,
            });
          }
        });
      }
    });
  }

  public async findAdminRole() {
    return this.rolesRepossitory.repository.find({
      select: {
        name: true,
        id: true,
      },
      where: {
        type: RoleTypes.Admin,
      },
    });
  }

  public async findAllByConditions(conditions: FindManyOptions) {
    return this.rolesRepossitory.repository.find(conditions);
  }
}
