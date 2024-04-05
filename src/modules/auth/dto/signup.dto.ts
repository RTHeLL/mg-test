import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { Match, IsPhoneNumber } from '@common/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
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
