import { DataSource } from 'typeorm';
import { ENTITY_CONST } from './organization.constant';
import { OrganizationEntity } from './organization.entity';

export const organizationProvider = [
  {
    provide: ENTITY_CONST.MODEL_PROVIDER,
    useFactory: (connection: DataSource) =>
      connection.getRepository(OrganizationEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
