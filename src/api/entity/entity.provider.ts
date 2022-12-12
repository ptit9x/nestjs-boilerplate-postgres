import { Connection } from 'typeorm';
import { ENTITY_CONST } from './entity.constant';
import { EntityEntity } from './entity.entity';

export const entityProvider = [
  {
    provide: ENTITY_CONST.MODEL_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.getRepository(EntityEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
