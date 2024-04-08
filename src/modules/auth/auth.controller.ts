import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignInDtoRequest,
  SignInDtoResponse,
  SignUpDtoRequest,
  SignUpDtoResponse,
} from './dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { RefreshTokenDtoRequest } from '@auth/dto/request/refreshToken.dto.request';
import { RefreshTokenDtoResponse } from '@auth/dto/response/refreshToken.dto.response';

/**
 * Controller for authorization and authentication
 */
@ApiTags('Авторизация и аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Method for creating new user
   *
   * @fires AuthService#signUp - method for creating new user
   * @param {SignUpDtoRequest} data - request body
   * @return {Promise<SignUpDtoResponse>} - new user
   */
  @ApiOperation({
    summary: 'Регистрация',
    operationId: 'auth.signUp',
  })
  @ApiCreatedResponse({ type: SignUpDtoResponse })
  @ApiBadRequestResponse({ description: 'Некорректные данные' })
  @ApiInternalServerErrorResponse({ description: 'Внутренняя ошибка сервера' })
  @Post('signup')
  async signUp(@Body() data: SignUpDtoRequest): Promise<SignUpDtoResponse> {
    const user = await this.authService.signUp(data);

    if (!user) {
      throw new BadRequestException(
        `Не удалось создать аккаунт с данными: ${JSON.stringify(data)}`,
      );
    }

    return plainToInstance(SignUpDtoResponse, user);
  }

  /**
   * Method for signing in
   *
   * @fires AuthService#signIn - method for signing in
   * @param {SignInDtoRequest} data - request body
   * @return {Promise<SignInDtoResponse>} - tokens
   */
  @ApiOperation({
    summary: 'Авторизация',
    operationId: 'auth.signIn',
  })
  @ApiCreatedResponse({ type: SignInDtoResponse })
  @ApiBadRequestResponse({ description: 'Некорректные данные' })
  @ApiUnauthorizedResponse({ description: 'Неверный логин или пароль' })
  @ApiInternalServerErrorResponse({ description: 'Внутренняя ошибка сервера' })
  @Post('signin')
  async signIn(@Body() data: SignInDtoRequest): Promise<SignInDtoResponse> {
    const tokens = await this.authService.signIn(data);

    if (!tokens) {
      throw new BadRequestException('Не удалось войти в аккаунт');
    }

    return plainToInstance(SignInDtoResponse, tokens);
  }

  /**
   * Method for refreshing tokens
   *
   * @fires AuthService#refresh - method for refreshing tokens
   * @param {RefreshTokenDtoRequest} data - request body
   * @return {Promise<RefreshTokenDtoResponse>} - tokens
   */
  @ApiOperation({
    summary: 'Обновление токена',
    operationId: 'auth.refreshToken',
  })
  @ApiCreatedResponse({ type: RefreshTokenDtoResponse })
  @ApiBadRequestResponse({ description: 'Некорректные данные' })
  @ApiUnauthorizedResponse({ description: 'Неверный токен обновления' })
  @ApiInternalServerErrorResponse({ description: 'Внутренняя ошибка сервера' })
  @Post('refresh')
  async refresh(
    @Body() data: RefreshTokenDtoRequest,
  ): Promise<RefreshTokenDtoResponse> {
    const tokens = await this.authService.refresh(data);
    return plainToInstance(RefreshTokenDtoResponse, tokens);
  }
}
