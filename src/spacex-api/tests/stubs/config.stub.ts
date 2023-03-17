import { ConfigModule } from '@nestjs/config';

export const configStub = () =>
  ConfigModule.forRoot({
    ignoreEnvVars: true,
    ignoreEnvFile: true,
    load: [
      () => ({
        IntersectionOptions: {
          SPACEX_API_URL: 'https://fakeapi.com/api',
        },
      }),
    ],
  });
