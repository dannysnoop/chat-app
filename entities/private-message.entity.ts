import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Group } from './group.entity';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class PrivateMessage extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => User)
  recipient: User;
}
