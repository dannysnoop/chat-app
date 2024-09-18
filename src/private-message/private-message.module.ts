import { forwardRef, Module } from "@nestjs/common";
import { PrivateMessageController } from './private-message.controller';
import { PrivateMessageService } from './private-message.service';
import { PrivateMessageRepository } from './private-message.repository';
import { UserModule } from "../user/user.module";
import { RedisService } from "../../lib/redis.service";

@Module({
  controllers: [PrivateMessageController],
  imports:[forwardRef(() => UserModule)],
  providers: [PrivateMessageService, PrivateMessageRepository , RedisService],
  exports: [PrivateMessageService, PrivateMessageRepository],
})
export class PrivateMessageModule {}
