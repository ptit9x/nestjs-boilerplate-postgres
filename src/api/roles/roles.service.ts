import { Injectable, OnModuleInit } from '@nestjs/common';
import { type } from 'os';
import { FindManyOptions, In } from 'typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { RoleEntity } from './entities/role.entity';
import { ROLES_DEFAULT, RoleTypes } from './roles.constant';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    private readonly rolesRepossitory: RolesRepository,
    private readonly permissionService: PermissionsService,
  ) {}

  async onModuleInit() {
    const rolesListExisted = await this.rolesRepossitory.findExistedRecord();
    if (rolesListExisted?.length) return;

    for (const role of ROLES_DEFAULT) {
      const roleExisted = await this.rolesRepossitory.findOneByCondition({
        where: { name: role.name },
      });
      if (!roleExisted) {
        const permissions = await this.permissionService.find({
          where: {
            name: In(role.permissions),
          },
        });
        const rModel = new RoleEntity();
        rModel.name = role.name;
        rModel.type = role.type;
        rModel.permissions = permissions;
        await this.rolesRepossitory.save(rModel);
      }
    }
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

  public findAllByConditions(conditions: FindManyOptions) {
    return this.rolesRepossitory.repository.find(conditions);
  }
}
