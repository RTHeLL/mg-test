import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookie = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (key && key in request.cookies) {
      return request.cookies[key];
    } else if (key) {
      return null;
    } else {
      return request.cookies;
    }
  },
);
