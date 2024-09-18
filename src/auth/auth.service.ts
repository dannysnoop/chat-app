import { Inject, Injectable } from '@nestjs/common';
const jwt = require('jsonwebtoken');
import { UserLoginDto } from '../../DTO/user-login.dto';
import { IUserService } from '../user/i.user.service';
import * as process from 'process';
import { RedisService } from '../../lib/redis.service';
import { preUserToken } from '../../utility/random-character';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserService') private readonly IUserService: IUserService,
    private redis: RedisService,
  ) {}

  async validateUser(userLogin: UserLoginDto) {
    const data = await this.IUserService.checkUserByEmailAndPassword(userLogin);
    const access_token = jwt.sign({ ...data }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    await this.redis.set(preUserToken(access_token), access_token);
    return {
      access_token,
    };
  }
}
