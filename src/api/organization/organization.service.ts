import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { ILike, DataSource, Not, In } from 'typeorm';
import { StringUtil } from '../../share/utils/string.util';
import { UserStatus } from '../user/user.constant';
import { UserEntity } from '../user/user.entity';
import {
  DEFAULT_ORGANIZATION,
  ERROR_ORGANIZATION,
  ROLES_ORGANIZATION_DEFAULT,
} from './organization.constant';
import { OrganizationEntity } from './organization.entity';
import { OrganizationRepository } from './organization.repository';
import { UpdateOrganizationDto } from './dto/organization.dto';
import { QueryParamDto } from './dto/query-param.dto';
import { RoleEntity } from '../role/role.entity';
import { PermissionsService } from '../permission/permission.service';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly permissionService: PermissionsService,
    @Inject('DATABASE_CONNECTION') private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    const exist = await this.organizationRepository.findExistedRecord();
    if (!exist?.length) {
      const oModel = new OrganizationEntity();
      oModel.id = DEFAULT_ORGANIZATION.id;
      oModel.name = DEFAULT_ORGANIZATION.name;
      const organization = await this.organizationRepository.save(oModel);

      for (const role of ROLES_ORGANIZATION_DEFAULT) {
        const permissions = await this.permissionService.find({
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
    return this.organizationRepository.findAllByConditions(conditions, query, [
      'users',
    ]);
  }

  async create({ name, description }): Promise<OrganizationEntity> {
    const exist = await this.organizationRepository.repository.findOneBy({
      name,
    });
    if (exist) {
      throw new BadRequestException(ERROR_ORGANIZATION.EXIST);
    }

    return this.organizationRepository.save({ name, description });
  }

  async get(id: number): Promise<OrganizationEntity> {
    const data = await this.organizationRepository.repository.findOne({
      where: {
        id,
      },
      relations: ['users'],
    });
    if (!data) {
      throw new BadRequestException(ERROR_ORGANIZATION.NOT_FOUND);
    }
    return data;
  }

  public async update(
    id: number,
    body: UpdateOrganizationDto,
  ): Promise<boolean> {
    const data = await this.organizationRepository.repository.findOneBy({ id });
    if (!data) throw new BadRequestException(ERROR_ORGANIZATION.NOT_FOUND);
    const exist = await this.organizationRepository.repository.count({
      where: {
        name: body.name,
        id: Not(id),
      },
    });
    if (exist) {
      throw new BadRequestException(ERROR_ORGANIZATION.EXIST);
    }
    await this.organizationRepository.update(id, body);
    return true;
  }

  public async delete(id: number): Promise<true> {
    if (id === DEFAULT_ORGANIZATION.id) {
      throw new BadRequestException(
        ERROR_ORGANIZATION.CANNOT_DELETE_FOUNDATION_ORGANIZATION,
      );
    }
    const data = await this.organizationRepository.repository.findBy({ id });
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
