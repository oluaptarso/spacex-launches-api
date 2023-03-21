import {
  CacheInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { GetNextAndLatestLaunchesOutput } from 'src/dto/launch/get-dashboard-launches.output';
import { LaunchDto } from 'src/dto/launch/launch.dto';
import { PaginatedOutput } from 'src/dto/paginated.output';
import { FormatResponseInterceptor } from 'src/format-response/interceptors/format-response.interceptor';
import { SpacexAPIService } from './spacex-api.service';

@Controller('spacex-api')
@UseInterceptors(CacheInterceptor)
@UseInterceptors(FormatResponseInterceptor)
export class SpacexApiController {
  constructor(private readonly apiService: SpacexAPIService) {}

  @Get('launches/latest')
  getLatestLaunch(): Promise<LaunchDto> {
    return this.apiService.getLatestLaunch();
  }

  @Get('launches/next')
  getNextLaunch(): Promise<LaunchDto> {
    return this.apiService.getNextLaunch();
  }

  @Get('launches/upcoming')
  getUpcomingLaunches(
    @Query('page') page = 1,
  ): Promise<PaginatedOutput<LaunchDto>> {
    return this.apiService.getUpcomingLaunches(page);
  }

  @Get('launches/past')
  getPastLaunches(
    @Query('page') page = 1,
  ): Promise<PaginatedOutput<LaunchDto>> {
    return this.apiService.getPastLaunches(page);
  }

  @Get('launches/next_and_latest')
  async getNextAndLatestLaunches(): Promise<GetNextAndLatestLaunchesOutput> {
    const data = await Promise.all([
      this.apiService.getNextLaunch(),
      this.apiService.getLatestLaunch(),
    ]);

    return {
      next: data[0],
      latest: data[1],
    };
  }
}
