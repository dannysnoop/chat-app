import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { User } from '../entities/user.entity';
import { PostEntity } from '../entities/post.entity';
import { Message } from '../entities/message.entity';
import { Group } from '../entities/group.entity';
import { PrivateMessage } from "../entities/private-message.entity";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
export const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_URL,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Message, Group, PostEntity, PrivateMessage],
  synchronize: true,
};
