import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { RedisService } from '../../lib/redis.service';

@Module({
  imports: [PassportModule, forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: 'IUserService', useClass: UserService },
    RedisService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
