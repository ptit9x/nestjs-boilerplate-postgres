import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { RoleTypes, ROLE_CONST } from '../roles.constant';
import { PermissionEntity } from 'src/api/permissions/entities/permission.entity';
import { UserEntity } from 'src/api/user/user.entity';

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

  @ManyToMany(() => PermissionEntity)
  @JoinTable()
  @JoinTable({
    // name: 'role_permissions_permission',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id' },
  })
  permissions: PermissionEntity[];

  @ManyToMany(() => UserEntity)
  users: UserEntity[];
}
