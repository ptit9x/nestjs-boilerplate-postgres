import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './payloads/jwt-payload';
import { JWT_CONFIG } from '../../configs/constant.config';
import { ERROR_AUTH } from './auth.constant';
import { UserEntity } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IGoogleProfile } from './auth.interface';
import { UserProviderEntity } from '../user/user-provider.entity';
import { ProviderType } from '../user/user.constant';
import { RoleTypes } from '../role/role.constant';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private dataSource: DataSource,
  ) {}
  createAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: JWT_CONFIG.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: JWT_CONFIG.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });
  }

  createRefreshToken({ userId }): Promise<string> {
    return this.jwtService.signAsync(
      { userId },
      {
        secret: JWT_CONFIG.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: JWT_CONFIG.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      },
    );
  }

  async generateTokenResponse(user: UserEntity): Promise<LoginResponseDto> {
    const refreshToken = await this.createRefreshToken({ userId: user.id });
    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      fullName: user.name,
      roles: user?.roles,
    };

    return {
      accessToken: await this.createAccessToken(payload),
      accessTokenExpire: JWT_CONFIG.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      refreshToken,
      refreshTokenExpire: JWT_CONFIG.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      isFirstTimeLogin: !user.lastLogin,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['roles'],
    });

    const isRightPassword = bcrypt.compareSync(password, user?.password);
    if (!user || !isRightPassword) {
      throw new BadRequestException(ERROR_AUTH.PASSWORD_INCORRECT.MESSAGE);
    }

    await user.save();

    return this.generateTokenResponse(user);
  }

  async refreshToken(id: string): Promise<LoginResponseDto> {
    if (!id) {
      throw new InternalServerErrorException(' Invalid user id');
    }
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['roles'],
    });
    return this.generateTokenResponse(user);
  }

  async removeRefreshToken(userId: string) {
    await this.userService.removeRefreshToken(userId);
    return {
      status: true,
    };
  }

  async findOrCreateUserFromGoogleProfile(
    profile: IGoogleProfile,
  ): Promise<UserEntity> {
    const { id, emails, displayName } = profile;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let user = await this.userService.getByEmail(emails[0].value);
      if (!user) {
        await this.userService.createUser(
          {
            name: displayName,
            email: emails[0].value,
          },
          RoleTypes.User,
        );
      }
      const uProvider = await queryRunner.manager
        .createQueryBuilder(UserProviderEntity, 'upe')
        .where('upe.providerKey = :providerKey AND upe.type = :type', {
          providerKey: id,
          type: ProviderType.GOOGLE,
        })
        .getOne();
      if (!uProvider) {
        const uProviderModel = new UserProviderEntity();
        uProviderModel.providerKey = id;
        uProviderModel.user = user;
        await queryRunner.manager.save(uProviderModel);
      }

      await queryRunner.commitTransaction();

      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error?.message);
      throw new BadRequestException(error?.message);
    } finally {
      await queryRunner.release();
    }
  }
}
