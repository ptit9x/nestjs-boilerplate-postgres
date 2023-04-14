import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ILike, DataSource, In, Repository } from 'typeorm';
import { StringUtil } from '../../share/utils/string.util';
import { UserStatus } from '../user/user.constant';
import { UserEntity } from '../user/user.entity';
import {
  DEFAULT_ORGANIZATION,
  ERROR_ORGANIZATION,
  ROLES_ORGANIZATION_DEFAULT,
} from './organization.constant';
import { OrganizationEntity } from './organization.entity';
import { QueryParamDto } from './dto/query-param.dto';
import { RoleEntity } from '../role/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../share/database/base.service';
import { PermissionEntity } from '../permission/permission.entity';

@Injectable()
export class OrganizationService extends BaseService<OrganizationEntity> {
  private readonly logger = new Logger(OrganizationService.name);
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly organizationRepository: Repository<OrganizationEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    private dataSource: DataSource,
  ) {
    super(organizationRepository);
  }

  async onModuleInit() {
    const count = await this.organizationRepository.countBy({});
    if (count === 0) {
      const oModel = new OrganizationEntity();
      oModel.id = DEFAULT_ORGANIZATION.id;
      oModel.name = DEFAULT_ORGANIZATION.name;
      const organization = await this.organizationRepository.save(oModel);

      for (const role of ROLES_ORGANIZATION_DEFAULT) {
        const permissions = await this.permissionRepository.find({
          where: {
            name: In(role.permissions),
          },
        });
        const rModel = new RoleEntity();
        rModel.name = role.name;
        rModel.type = role.type;
        rModel.permissions = permissions;
        rModel.organizations = [organization];
        await rModel.save();
      }
    }
  }

  public async search(query: QueryParamDto) {
    const conditions: any = {};
    if (!query.sortOrder && !query.sortBy) {
      query.sortOrder = `asc`;
      query.sortBy = `id`;
    }
    if (query.search) {
      conditions.organizationName = ILike(
        `%${StringUtil.mysqlRealEscapeString(query.search)}%`,
      );
    }
    return this.getPagination(conditions, query, ['users']);
  }

  public async delete(id: number): Promise<true> {
    if (id === DEFAULT_ORGANIZATION.id) {
      throw new BadRequestException(
        ERROR_ORGANIZATION.CANNOT_DELETE_FOUNDATION_ORGANIZATION,
      );
    }
    const data = await this.organizationRepository.findBy({ id });
    if (!data) {
      throw new BadRequestException(ERROR_ORGANIZATION.NOT_FOUND);
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(
        UserEntity,
        { organizationId: id },
        { status: UserStatus.INACTIVE },
      );
      await queryRunner.manager.softDelete(OrganizationEntity, { id });
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error?.message);
      throw new BadRequestException(error?.message);
    } finally {
      await queryRunner.release();
    }
  }
}
