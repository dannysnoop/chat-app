import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Group } from './group.entity';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  content: string;

  // Many-to-one relationship between messages and groups
  @ManyToOne(() => Group, (group) => group.messages)
  group: Group;

  // Many-to-one relationship between messages and users
  @ManyToOne(() => User, (user) => user)
  sender: User;

}
