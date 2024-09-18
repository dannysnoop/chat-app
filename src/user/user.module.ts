import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { CacheModule } from "@nestjs/cache-manager";
import { RedisService } from "../../lib/redis.service";

@Module({
  imports:[CacheModule.register()],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    { provide: 'IUserService', useClass: UserService },
    RedisService
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
