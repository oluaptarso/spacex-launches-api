import { LaunchDto } from './launch.dto';

export interface GetDashboardLaunchesOutput {
  next: LaunchDto;
  latest: LaunchDto;
}
