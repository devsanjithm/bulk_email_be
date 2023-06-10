import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    response.setHeader('x-powered-by', 'TODI');
    response.on('close', () => {
      let finalString = `\x1b[33m${new Date().toLocaleString()}\x1b[0m \x1b[31m${
        request.method
      }\x1b[0m \x1b[36m${request.originalUrl}\x1b[0m \x1b[38;5;11m (${
        response.statusCode
      })\x1b[0m`;

      this.logger.log(finalString);
    });

    next();
  }
}
