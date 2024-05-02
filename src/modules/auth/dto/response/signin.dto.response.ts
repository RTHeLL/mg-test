import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for signing in response
 *
 * @class SignInDtoResponse
 * @property {string} accessToken - access token
 */
@Exclude()
export class SignInDtoResponse {
  @Expose()
  @ApiProperty({
    required: true,
    description: 'Токен авторизации',
  })
  accessToken: string;
}
