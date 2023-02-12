import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import * as Sentry from '@sentry/node';
import { Request, Response } from 'express';
import * as slug from 'slug';

@Catch()
export class SentryExceptionsFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception?.getStatus?.() || 500;
    const message =
      exception.response?.message?.length && exception.response
        ? exception.response?.message?.join?.(', ')
        : exception.message;
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
      ...{ ...(exception.response || {}) },
      statusCode: status,
      timestamp,
      message,
      messageKey,
    });
  }
}
