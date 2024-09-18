import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { RedisService } from '../lib/redis.service';
import { preUserToken } from '../utility/random-character';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private redis: RedisService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log(token)
    if (!token) {
      throw new UnauthorizedException();
    }

    const tokenUserRedis = this.redis.get(preUserToken(token));
    if (!tokenUserRedis) {
      throw new UnauthorizedException();
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const {password , ...data} = payload
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = data;
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
