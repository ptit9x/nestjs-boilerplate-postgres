import { DataSource } from 'typeorm';
import { ENTITY_CONST } from './entity.constant';
import { EntityEntity } from './entity.entity';

export const entityProvider = [
  {
    provide: ENTITY_CONST.MODEL_PROVIDER,
    useFactory: (connection: DataSource) =>
      connection.getRepository(EntityEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
