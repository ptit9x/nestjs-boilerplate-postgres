import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProviderType, USER_CONST } from './user.constant';
import { BaseEntity } from '../../share/database/base.entity';
import { UserEntity } from './user.entity';
@Entity({ name: USER_CONST.MODEL_PROVIDER_NAME })
export class UserProviderEntity extends BaseEntity {
  @Column({ length: 255, unique: true })
  providerKey: string;

  @Column({ type: 'enum', enum: ProviderType, default: ProviderType.GOOGLE })
  type: number;

  @Column({ name: 'user_id', type: 'bigint', nullable: true })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.userProviders)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
