import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserStatus, USER_CONST } from './user.constant';
import { BaseEntity } from '../../share/database/base.entity';
import { RoleEntity } from '../role/role.entity';
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

  @Column({ type: 'bigint', name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ length: 14, nullable: true })
  phone: string;

  @Column({ length: 255, name: 'user_agent', nullable: true })
  userAgent: string;

  @Column({ length: 1000, nullable: true })
  avatar: string;

  @Column({ length: 255, name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ type: 'timestamp', name: 'last_login', nullable: true })
  lastLogin: Date;

  @Column({ type: 'bigint', name: 'role_id' })
  roleId: string;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: RoleEntity;

  @Column({
    name: 'current_hashed_refresh_token',
    nullable: true,
  })
  @Exclude()
  currentHashedRefreshToken?: string;
}
