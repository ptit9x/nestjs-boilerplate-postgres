import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MOCK_USER, MOCK_USER_WITH_ROLE, UserStatus } from './user.constant';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { RoleEntity } from '../role/role.entity';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const mockedRepo = {
      findOne: jest.fn((id) => Promise.resolve(MOCK_USER_WITH_ROLE)),
      findOneBy: jest.fn((id) =>
        Promise.resolve({
          ...MOCK_USER,
          password:
            '$2b$12$VaegMcM07WIGh5ePNKydPuURhhzr6F5rFfuBz2BtkO.Ut.1PNDRbK',
          save: () => true,
        }),
      ),
      save: jest.fn((id) => Promise.resolve(true)),
      count: jest.fn(() => Promise.resolve(1)),
      countBy: jest.fn(() => Promise.resolve(1)),
      update: jest.fn((params) => Promise.resolve(true)),
      findAndCount: jest.fn((params) => Promise.resolve([MOCK_USER, 1])),
    };
    const mockRoleRepo = {};
    const user: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockedRepo,
        },
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: mockRoleRepo,
        },
      ],
    }).compile();

    userController = user.get<UserController>(UserController);
  });

  describe('getByEmail', () => {
    it('should return success', async () => {
      const result = await userController.getByEmail('ngochuynh1991@gmail.com');
      expect(result).toStrictEqual(MOCK_USER_WITH_ROLE);
    });
  });

  describe('changePassword', () => {
    it('should return success', async () => {
      const result = await userController.changePassword(
        {
          sub: 'xxx',
          email: 'ngochuynh1991@gmail.com',
          fullName: 'ngoc huynh',
        },
        {
          oldPassword: 'abcd1234',
          newPassword: 'abcd1234',
          confirmPassword: 'abcd1234',
        },
      );
      expect(result).toBe(true);
    });
  });

  describe('update', () => {
    it('should return success', async () => {
      const result = await userController.update(
        { id: '1' },
        {
          name: 'huynhdn',
          status: UserStatus.ACTIVE,
        },
      );
      expect(result).toBe(true);
    });
  });

  describe('findUser', () => {
    it('should return success', async () => {
      const result = await userController.findUser({
        page: 1,
        pageSize: 10,
        sortOrder: 'DESC',
        sortBy: 'id',
        search: 'x',
        status: String(UserStatus.ACTIVE),
      });
      expect(result).toStrictEqual({
        data: {
          ...MOCK_USER,
        },
        page: 1,
        pageSize: 10,
        totalItem: 1,
        totalPage: 1,
      });
    });
  });
});
