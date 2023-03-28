import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource, FindManyOptions, In } from 'typeorm';
import { PermissionsService } from '../permission/permission.service';
import { RoleEntity } from './role.entity';
import { ROLES_DEFAULT } from './role.constant';
import { RolesRepository } from './role.repository';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly permissionService: PermissionsService,
    @Inject('DATABASE_CONNECTION') private dataSource: DataSource,
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
        rModel.isSuperAdmin = role.isSuperAdmin || false;
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
      data,
    };
  }

  public findAllByConditions(conditions: FindManyOptions) {
    return this.rolesRepository.repository.find(conditions);
  }
}
