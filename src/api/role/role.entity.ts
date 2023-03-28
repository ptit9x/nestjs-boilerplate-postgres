import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { RoleStatus, RoleTypes, ROLE_CONST } from './role.constant';
import { PermissionEntity } from '../permission/permission.entity';
import { UserEntity } from '../user/user.entity';
import { OrganizationEntity } from '../organization/organization.entity';

@Entity({ name: ROLE_CONST.MODEL_NAME })
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 255, unique: true })
  name: string;

  @Column({ type: 'enum', enum: RoleTypes })
  type: number;

  @Column({ type: 'bigint', name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ type: 'boolean', name: 'is_super_admin', default: false })
  isSuperAdmin: boolean;

  @Column({ type: 'enum', enum: RoleStatus, default: RoleStatus.ACTIVE })
  status: number;

  @ManyToMany(() => PermissionEntity)
  @JoinTable({
    name: 'role_permission', // role_permissions_permission
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id' },
  })
  permissions: PermissionEntity[];

  @ManyToMany(() => OrganizationEntity)
  @JoinTable({
    name: 'organization_role',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'organization_id' },
  })
  organizations: OrganizationEntity[];

  @ManyToMany(() => UserEntity)
  users: UserEntity[];
}
