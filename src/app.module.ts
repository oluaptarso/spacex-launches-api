import * as Joi from 'joi';
import { SpacexAPIModule } from './spacex-api/spacex-api.module';
import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response/interceptors/format-response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        SPACEX_API_URL: Joi.string().required(),
      }),
      envFilePath: '.env',
    }),
    SpacexAPIModule,
    CacheModule.register({
      ttl: 1000 * 5, // milliseconds
      max: 10, // maximum number of items in cache
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatResponseInterceptor,
    },
  ],
})
export class AppModule {}
