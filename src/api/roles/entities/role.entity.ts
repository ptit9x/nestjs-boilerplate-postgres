import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleTypes, ROLE_CONST } from '../roles.constant';
import { RolePermissionEntity } from '../../../api/role-permission/entities/role-permission.entity';

@Entity({ name: ROLE_CONST.MODEL_NAME })
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 255, unique: true })
  name: string;

  @Column({ type: 'enum', enum: RoleTypes })
  type: number;

  @Column({ type: 'bigint', nullable: true })
  created_by: number;

  @OneToMany(
    () => RolePermissionEntity,
    (rolePermission) => rolePermission.role,
  )
  @JoinColumn({ name: 'role_id' })
  rolePermission!: RolePermissionEntity[];
}
