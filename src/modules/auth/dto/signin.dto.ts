import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SingInDto {
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
