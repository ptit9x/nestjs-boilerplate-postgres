import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';

import { UserService } from 'src/api/user/user.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './payloads/jwt-payload';
import { JWT_CONFIG } from '../../configs/constant.config';
import { UserStatus, UserTypes } from 'src/api/user/user.constant';
import { ERROR_AUTH } from './auth.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    const user = await this.userService.findByConditions({
      where: {
        email: email,
      },
      relations: ['role.rolePermission.permission'],
    });

    if (!user || user.type != UserTypes.ADMIN) {
      throw new BadRequestException(ERROR_AUTH.USER_NOT_FOUND.MESSAGE);
    }

    const isRightPassword = bcrypt.compareSync(password, user.password);
    if (!isRightPassword)
      throw new BadRequestException(ERROR_AUTH.PASSWORD_INCORRECT.MESSAGE);

    if (user.status == UserStatus.INACTIVE) {
      throw new BadRequestException(ERROR_AUTH.USER_INACTIVE.MESSAGE);
    }

    const jwtExpiresIn = parseInt(JWT_CONFIG.EXPIRED_IN);
    const scopes = [];
    if (user.role) {
      user.role.rolePermission.forEach((rolePermission) => {
        scopes.push(rolePermission.permission.name);
      });
    }

    const isFirstTimeLogin = !user.last_login;
    user.last_login = new Date(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    user.save();

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      isAdministrator: user.isAdministrator,
      scopes: scopes,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: JWT_CONFIG.SECRET,
        expiresIn: jwtExpiresIn,
      }),
      accessTokenExpire: jwtExpiresIn,
      isFirstTimeLogin: isFirstTimeLogin,
    };
  }
}
