import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONFIG } from '../../configs/constant.config';
import { Response, NextFunction, Request } from 'express';

// Extend the Request interface to include the 'user' property
declare module 'express' {
  export interface Request {
    user?: any;
  }
}

@Injectable()
export class DecodeTokenMiddleware implements NestMiddleware {
  use(request: Request, _response: Response, next: NextFunction): void {
    const token: string = request.headers.authorization;
    if (token) {
      const jwtService = new JwtService({
        secret: JWT_CONFIG.JWT_ACCESS_TOKEN_SECRET,
        signOptions: {
          expiresIn: JWT_CONFIG.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
        },
      });
      request.user = jwtService.decode(token.substring(7));
    }
    next();
  }
}
