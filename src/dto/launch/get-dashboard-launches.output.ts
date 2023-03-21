import { LaunchDto } from './launch.dto';

export interface GetNextAndLatestLaunchesOutput {
  next: LaunchDto;
  latest: LaunchDto;
}
