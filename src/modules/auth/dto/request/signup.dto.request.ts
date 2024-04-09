import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Match, IsPhoneNumber } from '@common/decorators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for signing up request
 *
 * @class SignUpDtoRequest
 * @property {string} email - email
 * @property {string} phoneNumber - phone number
 * @property {string} password - password
 * @property {string} passwordConfirmation - password confirmation
 * @property {string} firstName - first name
 * @property {string} lastName - last name
 */
export class SignUpDtoRequest {
  @ApiPropertyOptional({
    description: 'Почта',
    example: 'mail@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Некорректный email' })
  email?: string;

  @ApiProperty({
    required: true,
    description: 'Номер телефона',
    example: '+375XXXXXXXXX',
  })
  @IsString({ message: 'Номер телефона должен быть формата +375XXXXXXXXX' })
  @IsPhoneNumber(['RU', 'BY', 'KZ'], { message: 'Некорректный номер телефона' })
  phoneNumber: string;

  @ApiProperty({
    required: true,
    description: 'Пароль',
    example: '12345678',
  })
  @IsString({ message: 'Пароль должен содержать не менее 8 символов' })
  @IsStrongPassword(
    { minLength: 8 },
    { message: 'Пароль должен содержать не менее 8 символов' },
  )
  password!: string;

  @ApiProperty({
    required: true,
    description: 'Подтверждение пароля',
    example: '12345678',
  })
  @IsString()
  @Match('password', { message: 'Пароли не совпадают' })
  passwordConfirmation!: string;

  @IsString()
  @ApiProperty({
    required: false,
    description: 'Имя',
    example: 'Иван',
  })
  @IsString()
  firstName?: string;

  @IsString()
  @ApiProperty({
    required: false,
    description: 'Фамилия',
    example: 'Иванов',
  })
  @IsString()
  lastName?: string;
}
