import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { OrderDirectionEnum } from '../enums';
import { ApiQuery } from '@nestjs/swagger';

/**
 * Decorator for ordering
 *
 * @param data
 * @param ctx - execution context
 * @returns {[string, OrderDirectionEnum][]} - fields for ordering
 */
export const Ordering = createParamDecorator(
  (data, ctx: ExecutionContext): [string, OrderDirectionEnum][] => {
    const req = ctx.switchToHttp().getRequest();
    const order = req.query.order as string;

    if (!order) return null;

    return order
      ? order.split(',').map((order) => {
          const trimmedField = order.trim();
          const orderDirection = getOrderDirection(trimmedField);
          return [trimmedField.replace('-', ''), orderDirection];
        })
      : [];
  },
  [
    (target: any, key: string) => {
      ApiQuery({
        name: 'order',
        description:
          'Поля для сортировки. Можно передать сразу несколько полей через запятую. ' +
          'Для обратной в порядке убавления добавьте минус перед полем.',
        required: false,
        schema: { example: 'id,-firstName', type: 'string' },
      })(target, key, Object.getOwnPropertyDescriptor(target, key));
    },
  ],
);

function getOrderDirection(field: string): OrderDirectionEnum {
  return field.startsWith('-')
    ? OrderDirectionEnum.DESC
    : OrderDirectionEnum.ASC;
}
