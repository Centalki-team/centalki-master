import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerService {
  private winstonLogger: winston.Logger;
  constructor(private configService: ConfigService) {
    const fileTransport = new winston.transports.DailyRotateFile({
      filename: `${path.join(process.cwd(), `logs/`)}/application-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      // maxSize: '20m',
      // maxFiles: '14d'
    });
    const consoleTransport = new winston.transports.Console();
    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(
        (info) => `${info.timestamp} | ${info.level} | ${info.message}`,
      ),
    );
    this.winstonLogger = winston.createLogger({
      level: this.configService.get('app.logLevel'),
      format: logFormat,
      transports: [fileTransport, consoleTransport],
    });
  }
  error(message: string, ...meta: any[]) {
    this.winstonLogger.error(message, meta);
  }

  info(message: string, ...meta: any[]) {
    this.winstonLogger.info(message, meta);
  }

  debug(message: string, ...meta: any[]) {
    this.winstonLogger.debug(message, meta);
  }
}
