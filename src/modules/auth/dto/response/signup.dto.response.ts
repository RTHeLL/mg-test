import { IsEmail, IsString } from 'class-validator';
import { IsPhoneNumber } from '@common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

/**
 * DTO for signing up response
 *
 * @class SignUpDtoResponse
 * @property {string} email - email
 * @property {string} phoneNumber - phone number
 * @property {string} firstName - first name
 * @property {string} lastName - last name
 */
@Exclude()
export class SignUpDtoResponse {
  @ApiProperty({
    required: true,
    description: 'Почта',
    example: 'mail@example.com',
  })
  @IsEmail({}, { message: 'Некорректный email' })
  @Expose()
  email: string;

  @ApiProperty({
    required: true,
    description: 'Номер телефона',
    example: '+375XXXXXXXXX',
  })
  @IsString({ message: 'Номер телефона должен быть формата +375XXXXXXXXX' })
  @IsPhoneNumber(['RU', 'BY', 'KZ'], { message: 'Некорректный номер телефона' })
  @Expose()
  phoneNumber: string;

  @IsString()
  @ApiProperty({
    required: false,
    description: 'Имя',
    example: 'Иван',
  })
  @IsString()
  @Expose()
  firstName?: string;

  @IsString()
  @ApiProperty({
    required: false,
    description: 'Фамилия',
    example: 'Иванов',
  })
  @IsString()
  @Expose()
  lastName?: string;
}
