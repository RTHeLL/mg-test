import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * DTO for updating user request
 *
 * @class UpdateUserDtoRequest
 * @property {string} firstName - Имя
 * @property {string} lastName - Фамилия
 */
export class UpdateUserDtoRequest {
  @ApiPropertyOptional({
    required: false,
    description: 'Имя',
    example: 'Иван',
  })
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    required: false,
    description: 'Фамилия',
    example: 'Иванов',
  })
  @IsString()
  lastName?: string;
}
