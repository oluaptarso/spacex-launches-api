import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FormatResponseFilter } from './format-response/filters/format-response.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new FormatResponseFilter(httpAdapter));

  await app.listen(3001);
}
bootstrap();
