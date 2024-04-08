import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for signing in request
 *
 * @class SignInDtoRequest
 * @property {string} emailOrPhone - email or phone number
 * @property {string} password - password
 */
export class SignInDtoRequest {
  @ApiProperty({
    required: true,
    description: 'Почта или номер телефона',
    example: 'mail@example.com',
  })
  @IsString()
  emailOrPhone: string;

  @ApiProperty({
    required: true,
    description: 'Пароль',
    example: '12345678',
  })
  @IsString()
  password: string;
}
