import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class GatewaySecretGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (context.getType() === 'rpc') {
      return true;
    }

    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      const secretHeader = request.headers['x-gateway-secret'];
      const envSecret = process.env.GATEWAY_SECRET;

      if (!envSecret) {
        console.error('GATEWAY_SECRET is not defined in environment variables');
        throw new UnauthorizedException('Gateway secret is not configured');
      }

      if (!secretHeader || secretHeader !== envSecret) {
        throw new UnauthorizedException('Invalid or missing x-gateway-secret header');
      }

      return true;
    }

    return false;
  }
}