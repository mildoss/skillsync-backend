import {createParamDecorator, ExecutionContext, UnauthorizedException} from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'];

    if (!userId) {
      throw new UnauthorizedException('Missing x-user-id header from API Gateway');
    }

    return userId;
  }
)