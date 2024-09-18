import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  async onModuleInit() {
    this.client = new Redis({
      host: 'localhost', // Replace with your Redis host
      port: 6379, // Replace with your Redis port if necessary
      password: 'ecwcham123',
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async set(key: string, value: any, expiryInSeconds?: number) {
    if (expiryInSeconds) {
      await this.client.set(key, value, 'EX', expiryInSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }
}
