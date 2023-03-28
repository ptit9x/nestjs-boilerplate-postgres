import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from '../role/role.entity';
import { ENTITY_CONST } from './organization.constant';

@Entity({ name: ENTITY_CONST.MODEL_NAME })
export class OrganizationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, name: 'name', unique: true, nullable: false })
  name: string;

  @Column({ length: 2000, default: null })
  description: string;

  @ManyToMany(() => RoleEntity)
  @JoinTable({
    name: 'organization_role', // organization_roles_role: organization has a lot of role
    joinColumn: { name: 'organization_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: RoleEntity[];
}
