import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for find all users response
 *
 * @class UserDtoResponse
 * @property {number} id - ID пользователя
 * @property {string} email - Email пользователя
 * @property {string} phoneNumber - Номер телефона пользователя
 * @property {string} firstName - Имя пользователя
 * @property {string} lastName - Фамилия пользователя
 * @property {boolean} isActive - Статус активности пользователя
 * @property {Date} createdAt - Дата создания
 * @property {Date} updatedAt - Дата обновления
 */
@Exclude()
export class UserDtoResponse {
  @Expose()
  @ApiProperty({ example: 38, description: 'ID пользователя' })
  id: number;

  @Expose()
  @ApiProperty({
    example: 'mail@example.com',
    description: 'Email пользователя',
  })
  email: string;

  @Expose()
  @ApiProperty({
    example: '+15555555555',
    description: 'Номер телефона пользователя',
  })
  phoneNumber: string;

  @Expose()
  @ApiProperty({ example: 'John', description: 'Имя пользователя' })
  firstName: string;

  @Expose()
  @ApiProperty({ example: 'Doe', description: 'Фамилия пользователя' })
  lastName: string;

  @Expose()
  @ApiProperty({ example: true, description: 'Статус активности пользователя' })
  isActive: boolean;

  @Expose()
  @ApiProperty({
    example: '2024-04-08T06:24:40.768Z',
    description: 'Дата создания',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    example: '2024-04-08T06:24:40.768Z',
    description: 'Дата последнего обновления',
  })
  updatedAt: Date;
}
