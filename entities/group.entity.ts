import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;

  // Many-to-many relationship between users and groups
  @ManyToMany(() => User, (user) => user.groups, { cascade: true })
  @JoinTable()
  members: User[];

  // One-to-many relationship between groups and messages
  @OneToMany(() => Message, (message) => message.group)
  messages: Message[];
}
