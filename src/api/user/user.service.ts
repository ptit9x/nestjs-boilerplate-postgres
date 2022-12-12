import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { JWT_CONFIG, DEFAULT_ADMIN_USER } from 'src/configs/constant.config';
import { IPaginateParams } from 'src/share/common/app.interface';
import { StringUtil } from 'src/share/utils/string.util';
import { DataSource, FindManyOptions, FindOneOptions, Like } from 'typeorm';
import { ERROR_USER, UserStatus, UserTypes } from './user.constant';
import { UserEntity } from './user.entity';
import { IChangePassword, ICreateUser, IUpdateUser } from './user.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject('DATABASE_CONNECTION') private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    const userListFound = await this.userRepository.findExistedRecord();
    if (!userListFound?.length) {
      await this.userRepository.save({
        email: DEFAULT_ADMIN_USER.email,
        password: await bcrypt.hash(DEFAULT_ADMIN_USER.password, JWT_CONFIG.SALT_ROUNDS),
        name: DEFAULT_ADMIN_USER.name,
        type: UserTypes.ADMIN,
        is_administrator: true,
      });
    }
  }

  async getByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneByCondition({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException(ERROR_USER.USER_NOT_FOUND.MESSAGE);
    }
    return user;
  }

  async findByConditions(conditions: FindOneOptions): Promise<UserEntity> {
    const user = await this.userRepository.findOneByCondition(conditions);
    if (!user) {
      throw new NotFoundException(ERROR_USER.USER_NOT_FOUND.MESSAGE);
    }
    return user;
  }

  async findAllByConditions(
    conditions: FindManyOptions,
  ): Promise<UserEntity[]> {
    return this.userRepository.repository.find(conditions);
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

  async findUser(paginateParams: IPaginateParams) {
    const conditions: any = {};
    if (paginateParams.search) {
      conditions.name = Like(`%${StringUtil.mysqlRealEscapeString(paginateParams.search)}%`);
    }
    if (paginateParams.status) {
      conditions.status = Number(paginateParams.status) == UserStatus.ACTIVE ? 1 : 2;
    }
    return this.userRepository.findAllByConditions(conditions, paginateParams);
  }

  public async updateUser(id: number, paramsUpdate: IUpdateUser) {
    const userFound = await this.userRepository.repository.findOne({
      where: {
        id: id,
        isAdministrator: false,
      },
    });
    if (!userFound) {
      throw new NotFoundException();
    }
    const dataUpdate: IUpdateUser = {};
    if (paramsUpdate.name) {
      dataUpdate.name = paramsUpdate.name;
    }

    await this.userRepository.repository.update(id, dataUpdate);
    return {
      success: true,
    };
  }

  public async changePassword(id: number, paramsChangePassword: IChangePassword) {
    const userFound = await this.userRepository.findOneByCondition({
      where: {
        id: id,
      },
    });

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
    return {
      success: true,
    };
  }
}
