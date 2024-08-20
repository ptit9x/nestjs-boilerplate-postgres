import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MOCK_USER, MOCK_USER_WITH_ROLE, UserStatus } from './user.constant';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { RoleEntity } from '../role/role.entity';

describe('UserService', () => {
  let userService: UserService;

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
      save: jest.fn((id) => Promise.resolve(MOCK_USER)),
      count: jest.fn(() => Promise.resolve(1)),
      countBy: jest.fn(() => Promise.resolve(1)),
      update: jest.fn((p) =>
        Promise.resolve({
          raw: MOCK_USER,
          affected: 1,
          generatedMaps: [],
        }),
      ),
      findAndCount: jest.fn((p) => Promise.resolve([MOCK_USER, 1])),
    };
    const mockRoleRepo = {};
    const user: TestingModule = await Test.createTestingModule({
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

    userService = user.get<UserService>(UserService);
  });

  describe('getByEmail', () => {
    it('should return success', async () => {
      const result = await userService.getByEmail('ngochuynh1991@gmail.com');
      expect(result).toStrictEqual(MOCK_USER_WITH_ROLE);
    });
  });

  describe('update', () => {
    it('should return success', async () => {
      const result = await userService.update('1', {
        name: 'huynhdn',
        email: 'huynhdn@gmail.com',
        password: 'xxxxx',
        status: UserStatus.ACTIVE,
        createdBy: 1,
        phone: '0374539633',
      });
      expect(result).toStrictEqual({
        raw: MOCK_USER,
        affected: 1,
        generatedMaps: [],
      });
    });
  });

  describe('findUser', () => {
    it('should return success', async () => {
      const result = await userService.findUser({
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
