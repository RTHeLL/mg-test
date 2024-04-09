import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { IsPhoneNumber, Match } from '@common/decorators';

/**
 * DTO for creating new user request
 *
 * @class CreateUserDtoRequest
 * @property {string} email - Email пользователя
 * @property {string} phoneNumber - Номер телефона пользователя
 * @property {string} password - Пароль пользователя
 * @property {string} passwordConfirmation - Подтверждение пароля
 * @property {string} firstName - Имя пользователя
 * @property {string} lastName - Фамилия пользователя
 */
export class CreateUserDtoRequest {
  @ApiProperty({
    required: true,
    description: 'Почта',
    example: 'mail@example.com',
  })
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

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
