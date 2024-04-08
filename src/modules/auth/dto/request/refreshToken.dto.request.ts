import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for refreshing tokens request
 *
 * @class RefreshTokenDtoRequest
 * @property {string} refreshToken - refresh token
 */
export class RefreshTokenDtoRequest {
  @ApiProperty({
    required: true,
    description: 'Токен обновления',
  })
  @IsString()
  refreshToken: string;
}
