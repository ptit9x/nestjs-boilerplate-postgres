import { Exclude } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { UserStatus, USER_CONST } from './user.constant';
import { BaseEntity } from '../../share/database/base.entity';
import { RoleEntity } from '../roles/entities/role.entity';
@Entity({ name: USER_CONST.MODEL_NAME })
export class UserEntity extends BaseEntity {
  @Column({ length: 255, unique: true })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 200 })
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: number;

  @Column({ type: 'bigint', nullable: true })
  created_by: number;

  @Column({ length: 14, nullable: true })
  phone: string;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  @ManyToMany(() => RoleEntity)
  @JoinTable()
  @JoinTable({
    // name: "user_roles_role",
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: RoleEntity[];
}
