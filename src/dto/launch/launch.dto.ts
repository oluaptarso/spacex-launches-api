import { LaunchLinkDto } from './launch-link.dto';

export interface LaunchDto {
  links?: LaunchLinkDto;
  success: null | boolean;
  details: null | string;
  flight_number: number;
  date_utc: Date;
  date_unix: number;
  id: string;
}
