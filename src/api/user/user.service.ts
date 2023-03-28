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
import { BaseService } from 'src/share/database/base.service';
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

  // async createInternalUser(user: ICreateUser) {
  //   const userFoundByUsername = await this.userRepository.findOneByCondition({
  //     where: {
  //       name: user.name,
  //     },
  //   });
  //   if (userFoundByUsername) {
  //     throw new BadRequestException({
  //       message: ERROR.USER_NAME_EXISTED.MESSAGE,
  //       code: ERROR.USER_NAME_EXISTED.CODE,
  //     });
  //   }
  //   const userFound = await this.userRepository.findOneByCondition({
  //     where: {
  //       email: user.email,
  //     },
  //   });
  //   if (userFound) {
  //     throw new BadRequestException({
  //       message: ERROR.USER_EXISTED.MESSAGE,
  //       code: ERROR.USER_EXISTED.CODE,
  //     });
  //   }

  //   if (user.phone) {
  //     const userFoundPhone = await this.userRepository.findOneByCondition({
  //       where: {
  //         phone: user.phone,
  //       },
  //     });

  //     if (userFoundPhone) {
  //       throw new BadRequestException({
  //         message: ERROR.USER_PHONE_EXISTED.MESSAGE,
  //         code: ERROR.USER_PHONE_EXISTED.CODE,
  //       });
  //     }
  //   }
  //   const password = StringUtil.genRandomString(8);
  //   user.password = await bcrypt.hash(password, JWT_CONFIG.SALT_ROUNDS);
  //   dayjs.extend(customParseFormat);
  //   user.expired_date = dayjs(user.expired_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
  //   const newUser = await this.userRepository.save(user);
  //   const filePath = join(__dirname, `../../../share/templates/welcome-internal.hbs`);
  //   const source = fs.readFileSync(filePath, 'utf8').toString();
  //   const sourceReplace = source
  //     .replace(/<Username>/g, user.name)
  //     .replace(/<Email>/g, user.email)
  //     .replace(/<Password>/, password)
  //     .replace(/<adminUrl>/g, `${MEMBER_CONFIG.urlAdminSite}/login`);

  //   const template = hbs.compile(sourceReplace);
  //   const contentHtml = template(template);
  //   const mailOption = {
  //     mailTo: user.email,
  //     contentHtml: contentHtml,
  //     subject: SEND_EMAIL_CONFIG.welComeMemberSubject,
  //   };

  //   this.sendMailService.sendMail(mailOption);
  //   delete newUser.password;
  //   return newUser;
  // }

  // async createMultipleUsers(users: ICreateUser[]) {
  //   let countSuccess = 0;
  //   let countError = 0;
  //   const dataError = [];
  //   const queue = new PQueue({ concurrency: 50 });

  //   const queryRunner = this.dataSource.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     for (const user of users) {
  //       queue.add(async () => {
  //         try {
  //           const password = StringUtil.genRandomString(8);
  //           user.password = await bcrypt.hash(password, JWT_CONFIG.SALT_ROUNDS);
  //           dayjs.extend(customParseFormat);
  //           user.expired_date = dayjs(user.expired_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
  //           await queryRunner.manager.save(UserEntity, user);
  //           countSuccess++;
  //           this.sendMailWelcome(user, password);
  //         } catch (err) {
  //           dataError.push(pick(user, ['email', 'name']));
  //           countError++;
  //         }
  //       });
  //     }
  //     await queue.onIdle();
  //     await queryRunner.commitTransaction();
  //   } catch (err) {
  //     await queryRunner.rollbackTransaction();
  //   } finally {
  //     await queryRunner.release();
  //   }
  //   return {
  //     totalSuccess: countSuccess,
  //     totalError: countError,
  //     dataError: dataError,
  //   };
  // }

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

  removeRefreshToken(userId: string): Promise<any> {
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
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
