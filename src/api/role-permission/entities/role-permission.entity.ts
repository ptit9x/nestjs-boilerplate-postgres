import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';

import { PermissionEntity } from '../../../api/permissions/entities/permission.entity';
import { RoleEntity } from '../../../api/roles/entities/role.entity';
import { ROLE_PERMISION_CONST } from '../role-permission.constant';

@Entity({ name: ROLE_PERMISION_CONST.MODEL_NAME })
export class RolePermissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  role_id: number;

  @Column({ type: 'int' })
  permission_id: number;

  @ManyToOne(
    () => RoleEntity,
    (rolePermission) => rolePermission.rolePermission,
  )
  @JoinColumn({ name: 'role_id' })
  role!: RoleEntity;

  @ManyToOne(
    () => PermissionEntity,
    (rolePermission) => rolePermission.rolePermission,
  )
  @JoinColumn({ name: 'permission_id' })
  permission!: PermissionEntity;
}
