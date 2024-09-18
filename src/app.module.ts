import {  Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from '../database/db-config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './group/group.module';
import { PrivateMessageModule } from './private-message/private-message.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    UserModule,
    PostModule,
    AuthModule,
    GroupModule,
    PrivateMessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
