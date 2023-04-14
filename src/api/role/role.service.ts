import { Injectable, OnModuleInit } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { RoleEntity } from './role.entity';
import { ROLES_DEFAULT } from './role.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from '../permission/permission.entity';

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.rolesRepository.countBy({});
    if (count > 0) return;

    for (const role of ROLES_DEFAULT) {
      const roleExisted = await this.rolesRepository.findOneBy({
        name: role.name,
      });
      if (!roleExisted) {
        const permissions = await this.permissionRepository.find({
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
    const data = await this.rolesRepository.find(options);

    return {
      data,
    };
  }
}
