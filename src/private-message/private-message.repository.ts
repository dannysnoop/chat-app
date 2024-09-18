import { Get, Injectable, Post, Put } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PrivateMessage } from '../../entities/private-message.entity';

@Injectable()
export class PrivateMessageRepository extends Repository<PrivateMessage> {
  constructor(private dataSource: DataSource) {
    super(PrivateMessage, dataSource.createEntityManager());
  }
}
