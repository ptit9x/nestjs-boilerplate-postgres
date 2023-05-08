import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { MOCK_DATA } from './permission.constant';
import { PermissionEntity } from './permission.entity';

describe('PermissionController', () => {
  let permissionController: PermissionController;

  beforeEach(async () => {
    const mockedRepo = {
      find: jest.fn((params) => Promise.resolve([MOCK_DATA])),
    };
    const permission: TestingModule = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [
        PermissionService,
        {
          provide: getRepositoryToken(PermissionEntity),
          useValue: mockedRepo,
        },
      ],
    }).compile();

    permissionController =
      permission.get<PermissionController>(PermissionController);
  });

  describe('getPermissions', () => {
    it('should return success', async () => {
      const result = await permissionController.getPermissions();
      expect(result).toStrictEqual({
        data: [MOCK_DATA],
      });
    });
  });
});
