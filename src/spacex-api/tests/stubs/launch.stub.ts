import { LaunchDto } from 'src/dto/launch/launch.dto';

export const launchStub: LaunchDto = {
  links: {
    youtube_id: '5EwW8ZkArL4',
    article: null,
    wikipedia: 'https://en.wikipedia.org/wiki/SpaceX_Crew-5',
  },
  upcoming: true,
  success: true,
  details: null,
  flight_number: 187,
  date_utc: new Date('2022-10-05T16:00:00.000Z'),
  date_unix: 1664985600,
  id: '62dd70d5202306255024d139',
  name: 'FalconSat',
};
