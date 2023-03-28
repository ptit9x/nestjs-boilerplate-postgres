import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  // JoinTable,
  // ManyToMany,
} from 'typeorm';
import { PERMISSION_CONST } from './permission.constant';
// import { RoleEntity } from '../../../api/roles/entities/role.entity';

@Entity({ name: PERMISSION_CONST.MODEL_NAME })
export class PermissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 255, unique: true, enum: Object.values(PERMISSION_CONST) })
  name: string;

  // @ManyToMany(() => RoleEntity)
  // @JoinTable()
  // roles: RoleEntity[];
}
