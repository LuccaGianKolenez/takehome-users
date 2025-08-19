import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        // @ts-ignore
        store: await redisStore({ url: process.env.REDIS_URL }),
        ttl: 30_000,
      }),
    }),
    PrismaModule, 
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
