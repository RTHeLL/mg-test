import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { IPagination } from '../interfaces';
import { ApiQuery } from '@nestjs/swagger';

/**
 * Decorator for pagination
 *
 * @param {number} page - page number
 * @param {number} limit - limit
 * @returns {IPagination}
 */
export const Pagination = createParamDecorator(
  (data, ctx: ExecutionContext): IPagination => {
    const req = ctx.switchToHttp().getRequest();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;

    if (page < 1 || limit < 1) {
      throw new BadRequestException(
        'Номер страницы и лимит не могут быть меньше 1',
      );
    }

    if (limit > 100) {
      throw new BadRequestException(
        'Количество элементов на странице не может быть больше 100',
      );
    }

    const offset = (page - 1) * limit;

    return { page, limit, offset };
  },
  [
    (target: any, key: string) => {
      ApiQuery({
        name: 'page',
        description: 'Номер страницы',
        required: false,
        schema: { default: 1, type: 'number', minimum: 1 },
      })(target, key, Object.getOwnPropertyDescriptor(target, key));
      ApiQuery({
        name: 'limit',
        description: 'Количество элементов на странице',
        required: false,
        schema: { default: 15, type: 'number', minimum: 1, maximum: 100 },
      })(target, key, Object.getOwnPropertyDescriptor(target, key));
    },
  ],
);
