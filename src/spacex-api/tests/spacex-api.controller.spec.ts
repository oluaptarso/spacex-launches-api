import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { TestingModule, Test } from '@nestjs/testing';
import { LaunchDto } from 'src/dto/launch/launch.dto';
import { SpacexApiController } from '../spacex-api.controller';
import { SpacexAPIService } from '../spacex-api.service';
import { configStub } from './stubs/config.stub';
import { launchStub } from './stubs/launch.stub';

describe('SpacexApiController', () => {
  let controller: SpacexApiController;
  let service: DeepMocked<SpacexAPIService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [configStub()],
      providers: [
        { provide: HttpService, useValue: createMock<HttpService>() },
        { provide: SpacexAPIService, useValue: createMock<SpacexAPIService>() },
        { provide: CACHE_MANAGER, useValue: {} },
        SpacexApiController,
      ],
    }).compile();

    controller = module.get<SpacexApiController>(SpacexApiController);
    service = module.get(SpacexAPIService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLatestLaunch', () => {
    describe('when getLatestLaunch is called', () => {
      let launch: LaunchDto;

      beforeEach(async () => {
        service.getLatestLaunch.mockResolvedValueOnce(launchStub);

        launch = await controller.getLatestLaunch();
      });

      it('should call SpacexAPIService.getLatestLaunch', () => {
        expect(service.getLatestLaunch).toBeCalled();
      });

      it('should return a launch', () => {
        expect(launch).toEqual(launchStub);
      });
    });
  });
});
