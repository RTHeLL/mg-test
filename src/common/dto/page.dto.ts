import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for pagination
 *
 * @class PageDto
 * @template T
 * @property {T[]} data - array of data for pagination
 * @property {number} page - page number
 * @property {number} limit - limit
 * @property {number} itemCount - total count of items
 * @property {number} pageCount - count of items per page
 * @property {boolean} hasPreviousPage - has previous page
 * @property {boolean} hasNextPage - has next page
 */
export class PageDto<T> {
  @ApiProperty({
    isArray: true,
    example: [1, 2, 3],
    description: 'Массив данных',
  })
  @IsArray()
  readonly data: T[];

  @ApiProperty({ description: 'Номер страницы', example: 1 })
  readonly page: number;

  @ApiProperty({ description: 'Количество элементов на странице', example: 10 })
  readonly limit: number;

  @ApiProperty({ description: 'Общее количество элементов', example: 100 })
  readonly itemCount: number;

  @ApiProperty({ description: 'Количество страниц', example: 10 })
  readonly pageCount: number;

  @ApiProperty({ description: 'Есть ли предыдущая страница', example: false })
  readonly hasPreviousPage: boolean;

  @ApiProperty({ description: 'Есть ли следующая страница', example: true })
  readonly hasNextPage: boolean;

  constructor(data: T[], page: number, limit: number, itemCount: number) {
    this.data = data;
    this.page = page;
    this.limit = limit;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
