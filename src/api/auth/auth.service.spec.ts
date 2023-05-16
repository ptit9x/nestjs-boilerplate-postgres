import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JWT_CONFIG } from '../../configs/constant.config';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { MOCK_USER_WITH_ROLE } from '../user/user.constant';

describe('AuthService', () => {
  let authService: AuthService;
  const mockedRepo = {
    findOne: jest.fn((id) =>
      Promise.resolve({
        ...MOCK_USER_WITH_ROLE,
        password:
          '$2b$12$VaegMcM07WIGh5ePNKydPuURhhzr6F5rFfuBz2BtkO.Ut.1PNDRbK',
        save: () => true,
      }),
    ),
    save: jest.fn((id) => Promise.resolve(true)),
  };
  const mockUserService = {
    setCurrentRefreshToken: jest.fn((t: string) => Promise.resolve(true)),
    removeRefreshToken: jest.fn((id: string) => Promise.resolve(true)),
  };
  const mockJwtService = {
    signAsync: jest.fn((t: string) => Promise.resolve('xxx')),
  };

  beforeEach(async () => {
    const auth: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockedRepo,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = auth.get<AuthService>(AuthService);
  });

  describe('createAccessToken', () => {
    it('should return success', async () => {
      const result = await authService.createAccessToken({
        email: 'huynhdn@gmail.com',
        sub: 'xxxx',
        fullName: 'yyy',
      });
      expect(result).toEqual('xxx');
    });
  });

  describe('createRefreshToken', () => {
    it('should return success', async () => {
      const result = await authService.createRefreshToken({
        userId: 111,
      });
      expect(result).toEqual('xxx');
    });
  });

  describe('generateTokenResponse', () => {
    it('should return success', async () => {
      const result = await authService.generateTokenResponse({
        ...MOCK_USER_WITH_ROLE,
      } as any);
      expect(result).toStrictEqual({
        accessToken: 'xxx',
        accessTokenExpire: JWT_CONFIG.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
        refreshToken: 'xxx',
        refreshTokenExpire: JWT_CONFIG.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        isFirstTimeLogin: false,
      });
    });
  });

  describe('login', () => {
    it('should return success', async () => {
      const result = await authService.login({
        email: 'huynhdn@gmail.com',
        password: 'abcd1234',
      });
      expect(result).toStrictEqual({
        accessToken: 'xxx',
        accessTokenExpire: JWT_CONFIG.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
        refreshToken: 'xxx',
        refreshTokenExpire: JWT_CONFIG.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        isFirstTimeLogin: false,
      });
    });
  });

  describe('refreshToken', () => {
    it('should return success', async () => {
      const result = await authService.refreshToken('1111');
      expect(result).toStrictEqual({
        accessToken: 'xxx',
        accessTokenExpire: JWT_CONFIG.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
        refreshToken: 'xxx',
        refreshTokenExpire: JWT_CONFIG.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        isFirstTimeLogin: false,
      });
    });
  });

  describe('removeRefreshToken', () => {
    it('should return success', async () => {
      const result = await authService.removeRefreshToken('1111');
      expect(result).toStrictEqual({
        status: true,
      });
    });
  });
});
