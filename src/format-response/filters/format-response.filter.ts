import { Catch, ArgumentsHost, Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import { ResponseOutput } from '../response-output';

@Catch()
@Injectable()
export class FormatResponseFilter extends BaseExceptionFilter {
  constructor(private httpAdapter: AbstractHttpAdapter<any, any, any>) {
    super(httpAdapter);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() === 'http') {
      const response = host.switchToHttp().getResponse();

      const statusCode =
        (exception as any)?.status || HttpStatus.SERVICE_UNAVAILABLE;

      const responseOutput: ResponseOutput<null> = {
        statusCode: statusCode,
        success: false,
      };

      if (exception) {
        if (exception instanceof Error) {
          responseOutput.error = {
            name: exception.name,
            message: exception.message,
          };
        } else {
          responseOutput.error = exception;
        }
      }

      response.status(statusCode).send(responseOutput).end();
    }

    super.catch(exception, host);
  }
}
