import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ISearching } from '../interfaces/searching.interface';
import { ApiQuery } from '@nestjs/swagger';

/**
 * Decorator for searching
 *
 * @param data - fields for searching
 * @param ctx - execution context
 * @returns {ISearching}
 */
export const Searching = createParamDecorator(
  (data: string[], ctx: ExecutionContext): ISearching => {
    const req = ctx.switchToHttp().getRequest();

    const fields = data;
    const search = req.query.search as string;

    return { fields, search };
  },
  [
    (target: any, key: string) => {
      ApiQuery({
        name: 'search',
        description: 'Поисковая строка',
        required: false,
        schema: { example: 'John Doe', type: 'string' },
      })(target, key, Object.getOwnPropertyDescriptor(target, key));
    },
  ],
);
