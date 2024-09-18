import { Get, Injectable, Post, Put } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PostEntity } from '../../entities/post.entity';
import { Group } from '../../entities/group.entity';

@Injectable()
export class GroupRepository extends Repository<Group> {
  constructor(private dataSource: DataSource) {
    super(Group, dataSource.createEntityManager());
  }
}
