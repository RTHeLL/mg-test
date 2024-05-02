import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookie = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!key) {
      return request.cookies;
    }

    return request.cookies[key] || null;
  },
);
