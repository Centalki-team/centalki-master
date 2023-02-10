import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import * as Sentry from '@sentry/node';
import { Request, Response } from 'express';
import * as slug from 'slug';

@Catch()
export class SentryExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;
    const messageKey = slug(`${status}-${message}`);
    const { headers, body, query, params, method, originalUrl } = request;
    const timestamp = new Date().toISOString();
    Sentry.captureException(exception, {
      contexts: {
        headers,
        body,
        query,
        params,
      },
      tags: {
        method,
        originalUrl,
        status,
        messageKey,
        timestamp,
      },
    });

    response.status(status).json({
      statusCode: status,
      timestamp,
      message,
      messageKey,
    });
  }
}
