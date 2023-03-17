import { HttpService } from '@nestjs/axios/dist';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ConfigService } from '@nestjs/config/dist';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, ObservableInput } from 'rxjs';
import { LaunchDto } from 'src/dto/launch/launch.dto';
import { PaginatedOutput } from 'src/dto/paginated.output';
import { SPACEX_API_QUERY_SELECT } from './spacex-api.constants';

@Injectable()
export class SpacexAPIService {
  protected readonly logger: Logger = new Logger(SpacexAPIService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    if (httpService.axiosRef.defaults) {
      httpService.axiosRef.defaults.baseURL =
        this.configService.get('SPACEX_API_URL');
    }
  }

  async getLatestLaunch(): Promise<LaunchDto> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<any>('/launches/query', {
          query: {
            upcoming: false,
          },
          options: {
            limit: 1,
            sort: {
              flight_number: 'desc',
            },
            select: SPACEX_API_QUERY_SELECT,
          },
        })
        .pipe(catchError(this.logAndThrowApiError)),
    );

    if (data?.docs.length) return data.docs[0];

    return data;
  }

  async getNextLaunch(): Promise<LaunchDto> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<any>('/launches/query', {
          query: {
            upcoming: true,
          },
          options: {
            limit: 1,
            sort: {
              flight_number: 'desc',
            },
            select: SPACEX_API_QUERY_SELECT,
          },
        })
        .pipe(catchError(this.logAndThrowApiError)),
    );

    if (data?.docs.length) return data.docs[0];

    return null;
  }

  async getPastLaunches(page = 1): Promise<PaginatedOutput<LaunchDto>> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<any>('/launches/query', {
          query: {
            upcoming: false,
          },
          options: {
            sort: {
              flight_number: 'desc',
            },
            select: SPACEX_API_QUERY_SELECT,
            page,
          },
        })
        .pipe(catchError(this.logAndThrowApiError)),
    );
    return data;
  }

  async getUpcomingLaunches(page = 1): Promise<PaginatedOutput<LaunchDto>> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<any>('/launches/query', {
          query: {
            upcoming: true,
          },
          options: {
            sort: {
              flight_number: 'desc',
            },
            select: SPACEX_API_QUERY_SELECT,
            page,
          },
        })
        .pipe(catchError(this.logAndThrowApiError)),
    );
    return data;
  }

  private logAndThrowApiError = (error: AxiosError): ObservableInput<any> => {
    this.logger.error(error);
    throw new HttpException(
      'An error on SpaceX API happened!',
      HttpStatus.FAILED_DEPENDENCY,
    );
  };

  private throwNotFoundApiError = () => {
    throw new HttpException(
      'An error on SpaceX API happened!',
      HttpStatus.NOT_FOUND,
    );
  };
}
