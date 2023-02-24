import { Injectable, OnModuleInit } from '@nestjs/common';
import { FindManyOptions, In } from 'typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { RoleEntity } from './role.entity';
import { ROLES_DEFAULT } from './roles.constant';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly permissionService: PermissionsService,
  ) {}

  async onModuleInit() {
    const rolesListExisted = await this.rolesRepository.findExistedRecord();
    if (rolesListExisted?.length) return;

    for (const role of ROLES_DEFAULT) {
      const roleExisted = await this.rolesRepository.findOneByCondition({
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
        await this.rolesRepository.save(rModel);
      }
    }
  }

  public async findRole({ search, type }) {
    const options = {
      select: {
        name: true,
        id: true,
      },
      where: {},
      relations: ['permissions'],
    } as any;
    if (search) {
      options.where.search = In(search);
    }
    if (type) {
      options.where.type = type;
    }
    const data = await this.rolesRepository.repository.find(options);

    return {
      data
    }
  }

  public findAllByConditions(conditions: FindManyOptions) {
    return this.rolesRepository.repository.find(conditions);
  }
}
