import { LaunchLinkDto } from './launch-link.dto';

export interface LaunchDto {
  id: string;
  flight_number: number;
  name: string;
  details: null | string;
  date_utc: Date;
  date_unix: number;
  upcoming: boolean;
  success: null | boolean;
  links?: LaunchLinkDto;
}
