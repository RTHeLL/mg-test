// Reference: https://pietrzakadrian.com/blog/how-to-create-pagination-in-nestjs-with-typeorm-swagger

import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageDto } from '../dto';
import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';

/**
 * Decorator for paginated response
 *
 * @param model - model class
 * @param options - swagger options
 * @constructor
 */
export const ApiOkPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  options?: ApiResponseOptions,
) => {
  return applyDecorators(
    ApiExtraModels(PageDto),
    ApiOkResponse({
      description: 'Successfully received model list',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
      ...options,
    }),
  );
};
