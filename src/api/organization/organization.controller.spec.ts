import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { MOCK_ORG } from './organization.constant';
import { OrganizationEntity } from './organization.entity';
import { PermissionEntity } from '../permission/permission.entity';
import { DataSource } from 'typeorm';

describe('OrganizationController', () => {
  let organizationController: OrganizationController;

  beforeEach(async () => {
    const mockedRepo = {
      findOne: jest.fn((id) => Promise.resolve(MOCK_ORG)),
      findOneBy: jest.fn((id) => Promise.resolve(MOCK_ORG)),
      save: jest.fn((params) =>
        Promise.resolve({
          id: MOCK_ORG.id,
        }),
      ),
      count: jest.fn(() => Promise.resolve(1)),
      countBy: jest.fn(() => Promise.resolve(0)),
      update: jest.fn((params) => Promise.resolve(true)),
      findAndCount: jest.fn((params) => Promise.resolve([MOCK_ORG, 1])),
      delete: jest.fn((params) => Promise.resolve(true)),
      softDelete: jest.fn((params) => Promise.resolve(true)),
    };
    const organization: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationController],
      providers: [
        OrganizationService,
        {
          provide: getRepositoryToken(OrganizationEntity),
          useValue: mockedRepo,
        },
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(PermissionEntity),
          useValue: {},
        },
      ],
    }).compile();

    organizationController = organization.get<OrganizationController>(
      OrganizationController,
    );
  });

  describe('search', () => {
    it('should return success', async () => {
      const result = await organizationController.search({
        page: 1,
        pageSize: 10,
        sortOrder: 'DESC',
        sortBy: 'id',
        search: 'x',
      });
      expect(result).toStrictEqual({
        data: MOCK_ORG,
        page: 1,
        pageSize: 10,
        totalItem: 1,
        totalPage: 1,
      });
    });
  });

  describe('get', () => {
    it('should return success', async () => {
      const result = await organizationController.get({ id: '1' });
      expect(result).toStrictEqual(MOCK_ORG);
    });
  });

  describe('create', () => {
    it('should return success', async () => {
      const data = Object.assign(MOCK_ORG);
      delete data.id;
      delete data.createdAt;
      delete data.updatedAt;
      const result = await organizationController.create(data);
      expect(result).toStrictEqual({
        id: MOCK_ORG.id,
      });
    });
  });

  describe('update', () => {
    it('should return success', async () => {
      const data = Object.assign(MOCK_ORG);
      delete data.id;
      delete data.createdAt;
      delete data.updatedAt;
      const result = await organizationController.update(
        { id: MOCK_ORG.id },
        data,
      );
      expect(result).toStrictEqual(true);
    });
  });
});
