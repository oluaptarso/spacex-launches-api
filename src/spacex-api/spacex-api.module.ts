import { SpacexAPIService } from './spacex-api.service';
import { SpacexApiController } from './spacex-api.controller';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [SpacexApiController],
  providers: [SpacexAPIService],
})
export class SpacexAPIModule {}
