import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ROLE } from '../helper/constant';
import { Group } from './group.entity';
import { Message } from './message.entity';
import { PrivateMessage } from './private-message.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  username: string;

  @Column()
  password: string;
  @Column({
    type: 'enum',
    enum: ROLE,
    default: ROLE.MEMBER,
  })
  role: ROLE;

  @ManyToMany(() => Group, (group) => group.members )
  groups: Group[];
}
