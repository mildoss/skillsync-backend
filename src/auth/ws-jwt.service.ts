import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

@Injectable()
export class WsJwtService {
  private client = jwksClient({
    jwksUri: process.env.JWKS_URI as string,
    cache: true,
    rateLimit: true,
  });

  private getKey = (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) => {
    this.client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        callback(err);
        return;
      }

      if (!key) {
        callback(new Error('Signing key not found'));
        return;
      }

      callback(null, key.getPublicKey());
    });
  };

  async verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        this.getKey,
        {
          algorithms: ['RS256'],
          audience: process.env.JWT_AUDIENCE,
          issuer: process.env.JWT_ISSUER,
        },
        (err, decoded) => {
          if (err) reject(new UnauthorizedException('Invalid token'));
          else resolve(decoded);
        },
      );
    });
  }
}