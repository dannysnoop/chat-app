import { forwardRef, Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GroupRepository } from './group.repository';
import { UserModule } from '../user/user.module';
import { Message } from '../../entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from '../post/post.service';
import { RedisService } from "../../lib/redis.service";

@Module({
  controllers: [GroupController],
  imports: [forwardRef(() => UserModule), TypeOrmModule.forFeature([Message])],
  providers: [
    GroupService,
    GroupRepository,
    { provide: 'IGroupService', useClass: GroupService },
    RedisService
  ],
  exports: [GroupService, GroupRepository],
})
export class GroupModule {}
