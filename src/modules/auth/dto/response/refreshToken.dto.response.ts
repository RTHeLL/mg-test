import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for refreshing tokens response
 *
 * @class RefreshTokenDtoResponse
 * @property {string} accessToken - access token
 */
@Exclude()
export class RefreshTokenDtoResponse {
  @Expose()
  @ApiProperty({
    required: true,
    description: 'Токен авторизации',
  })
  accessToken: string;
}
