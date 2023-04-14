import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { MOCK_DATA, RoleTypes } from './role.constant';
import { RoleEntity } from './role.entity';
import { PermissionEntity } from '../permission/permission.entity';

describe('RoleController', () => {
  let roleController: RoleController;

  beforeEach(async () => {
    const mockedRepo = {
      find: jest.fn((params) => Promise.resolve([MOCK_DATA])),
    };
    const role: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: mockedRepo,
        },
        {
          provide: getRepositoryToken(PermissionEntity),
          useValue: {},
        },
      ],
    }).compile();

    roleController = role.get<RoleController>(RoleController);
  });

  describe('getRoles', () => {
    it('should return success', async () => {
      const result = await roleController.getRoles({
        search: 'x',
        type: String(RoleTypes.Admin),
      });
      expect(result).toStrictEqual({
        data: [MOCK_DATA],
      });
    });
  });
});
