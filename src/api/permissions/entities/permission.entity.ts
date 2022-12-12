import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PERMISSION_CONST } from '../permissions.constant';
import { RolePermissionEntity } from '../../../api/role-permission/entities/role-permission.entity';

@Entity({ name: PERMISSION_CONST.MODEL_NAME })
export class PermissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 255, unique: true, enum: Object.values(PERMISSION_CONST) })
  name: string;

  @OneToMany(
    () => RolePermissionEntity,
    (rolePermission) => rolePermission.permission,
  )
  @JoinColumn({ name: 'permission_id' })
  rolePermission!: RolePermissionEntity[];
}
