import { Entity } from 'typeorm';
import { ENTITY_CONST } from './entity.constant';
import { BaseEntity } from '../../share/database/base.entity';

@Entity({ name: ENTITY_CONST.MODEL_NAME })
export class EntityEntity extends BaseEntity {}
