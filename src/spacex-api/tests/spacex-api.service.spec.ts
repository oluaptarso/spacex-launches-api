import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosError, AxiosResponse } from 'axios';
import { map, of } from 'rxjs';
import { SpacexAPIService } from '../spacex-api.service';
import { configStub } from './stubs/config.stub';
import { launchStub } from './stubs/launch.stub';

describe('SpacexAPIService', () => {
  let service: SpacexAPIService;
  let httpService: DeepMocked<HttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [configStub()],
      providers: [
        { provide: HttpService, useValue: createMock<HttpService>() },
        SpacexAPIService,
      ],
    }).compile();

    service = module.get<SpacexAPIService>(SpacexAPIService);
    httpService = module.get(HttpService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLatestLaunch', () => {
    it('should throw an FAILED_DEPENDENCY error on a INTERNAL_SERVER_ERROR error from SpaceX API', async () => {
      httpService.post.mockImplementation(() => {
        return of({}).pipe(
          map(() => {
            throw new AxiosError('INTERNAL_SERVER_ERROR', '500');
          }),
        );
      });

      const getLatestLaunch = service.getLatestLaunch();
      await expect(getLatestLaunch).rejects.toBeInstanceOf(HttpException);
      await expect(getLatestLaunch).rejects.toThrow(
        new HttpException(
          'An error on SpaceX API happened!',
          HttpStatus.FAILED_DEPENDENCY,
        ),
      );
    });

    it('should return a Launch', async () => {
      httpService.post.mockReturnValueOnce(
        of({
          data: {
            docs: [launchStub],
          },
          headers: {},
          config: { url: '' },
          status: 200,
          statusText: '',
        } as AxiosResponse),
      );

      const getLatestLaunch = service.getLatestLaunch();
      await expect(getLatestLaunch).resolves.toBe(launchStub);
    });
  });
});
