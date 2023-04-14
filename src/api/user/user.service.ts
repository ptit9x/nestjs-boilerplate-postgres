import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JWT_CONFIG, DEFAULT_ADMIN_USER } from '../../configs/constant.config';
import { IPaginateParams } from '../../share/common/app.interface';
import { StringUtil } from '../../share/utils/string.util';
import { In, Like, Repository } from 'typeorm';
import { RoleStatus, ROLES_DEFAULT, RoleTypes } from '../role/role.constant';
import { ERROR_USER } from './user.constant';
import { UserEntity } from './user.entity';
import { IChangePassword } from './user.interface';
import { BaseService } from '../../share/database/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../role/role.entity';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {
    super(userRepository);
  }

  async onModuleInit() {
    const userCount = await this.userRepository.count({});
    if (userCount === 0) {
      const uModel = new UserEntity();
      uModel.email = DEFAULT_ADMIN_USER.email;
      uModel.password = await bcrypt.hash(
        DEFAULT_ADMIN_USER.password,
        JWT_CONFIG.SALT_ROUNDS,
      );
      uModel.name = DEFAULT_ADMIN_USER.name;
      uModel.roles = await this.roleRepository.find({
        where: {
          name: In(
            ROLES_DEFAULT.filter((r) => r.type === RoleTypes.Admin).map(
              (r) => r.name,
            ),
          ),
        },
      });
      await this.userRepository.save(uModel);
    }
  }

  async getByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email,
        roles: {
          status: RoleStatus.ACTIVE,
        },
      },
      relations: ['roles.permissions', 'organizations'],
    });
    if (!user) {
      throw new NotFoundException(ERROR_USER.USER_NOT_FOUND.MESSAGE);
    }
    return user;
  }

  findUser(params: IPaginateParams) {
    const conditions: any = {};
    if (params.search) {
      conditions.name = Like(
        `%${StringUtil.mysqlRealEscapeString(params.search)}%`,
      );
    }
    if (params.status) {
      conditions.status = Number(params.status);
    }
    return this.getPagination(conditions, params, ['roles']);
  }

  public async changePassword(
    id: string,
    paramsChangePassword: IChangePassword,
  ): Promise<boolean> {
    const userFound = await this.userRepository.findOneBy({ id });
    const { oldPassword, newPassword } = paramsChangePassword;
    const isRightPassword = bcrypt.compareSync(oldPassword, userFound.password);
    if (!isRightPassword) {
      throw new BadRequestException({
        message: ERROR_USER.USER_WRONG_OLD_PASSWORD.MESSAGE,
        code: ERROR_USER.USER_WRONG_OLD_PASSWORD.code,
      });
    }

    userFound.password = bcrypt.hashSync(newPassword, JWT_CONFIG.SALT_ROUNDS);
    userFound.save();

    return true;
  }

  async removeRefreshToken(userId: string): Promise<boolean> {
    await this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
    return true;
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        currentHashedRefreshToken: true,
      },
    });
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user?.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
    return null;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }
}
