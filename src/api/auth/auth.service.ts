import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/signup.dto';
import { RoleEntity } from '../role/role.entity';
import { RoleStatus, RoleTypes } from '../role/role.constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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
      role: user?.role,
    };

    return {
      accessToken: await this.createAccessToken(payload),
      accessTokenExpire: JWT_CONFIG.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      refreshToken,
      refreshTokenExpire: JWT_CONFIG.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      isFirstTimeLogin: !user.lastLogin,
    };
  }

  async checkExistsUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({
      email: email?.toLowerCase(),
    });

    if (!user) return true;

    throw new NotFoundException(ERROR_AUTH.USER_NAME_EXISTED.MESSAGE);
  }

  async signUp(data: SignUpDto): Promise<unknown> {
    await this.checkExistsUserByEmail(data.email);
    const passwordHash = await bcrypt.hash(
      data.password,
      JWT_CONFIG.SALT_ROUNDS,
    );
    const role = await this.roleRepository.findOneBy({
      type: RoleTypes.User,
      status: RoleStatus.ACTIVE,
    });

    const uModel = new UserEntity();
    uModel.email = data.email.toLowerCase();
    uModel.password = passwordHash;
    uModel.name = data.name;
    uModel.role = role;
    if (data.phone) {
      uModel.phone = data.phone;
    }
    return this.userRepository.save(uModel);
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    const user = await this.userService.getByEmail(email);

    const isRightPassword = bcrypt.compareSync(password, user?.password);
    if (!user || !isRightPassword) {
      throw new BadRequestException(ERROR_AUTH.PASSWORD_INCORRECT.MESSAGE);
    }

    user.lastLogin = new Date();

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
      relations: ['role.permissions'],
    });
    return this.generateTokenResponse(user);
  }

  async removeRefreshToken(userId: string) {
    await this.userService.removeRefreshToken(userId);
    return {
      status: true,
    };
  }
}
