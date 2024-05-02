import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
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
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { RefreshTokenDtoResponse } from '@auth/dto/response/refreshToken.dto.response';
import { UserAgent } from '@common/decorators/userAgent.decorator';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { toMs } from 'ms-typescript';
import { add } from 'date-fns';
import { ITokens } from '@auth/interfaces';
import { Cookie } from '@common/decorators/cookies.decorator';
import { REFRESH_TOKEN_COOKIE_NAME } from '@auth/config';

/**
 * Controller for authorization and authentication
 */
@ApiTags('Авторизация и аутентификация')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

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
   * @param {Response} res - response
   * @param {string} userAgent - user agent
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
  async signIn(
    @Body() data: SignInDtoRequest,
    @Res() res: Response,
    @UserAgent() userAgent: string,
  ): Promise<SignInDtoResponse> {
    const tokens = await this.authService.signIn(data, userAgent);

    if (!tokens) {
      throw new BadRequestException('Не удалось войти в аккаунт');
    }

    this.setRefreshToken(res, tokens);

    return plainToInstance(SignInDtoResponse, tokens);
  }

  /**
   * Method for refreshing tokens
   *
   * @fires AuthService#refresh - method for refreshing tokens
   * @param {string} refreshToken - refresh token
   * @param {Response} res - response
   * @param {string} userAgent - user agent
   */
  @ApiOperation({
    summary: 'Обновление токена',
    operationId: 'auth.refreshToken',
  })
  @ApiCreatedResponse({ type: RefreshTokenDtoResponse })
  @ApiBadRequestResponse({ description: 'Некорректные данные' })
  @ApiUnauthorizedResponse({ description: 'Неверный токен обновления' })
  @ApiInternalServerErrorResponse({ description: 'Внутренняя ошибка сервера' })
  @Get('refresh')
  async refresh(
    @Cookie(REFRESH_TOKEN_COOKIE_NAME) refreshToken: string,
    @Res() res: Response,
    @UserAgent() userAgent: string,
  ) {
    const tokens = await this.authService.refresh(refreshToken, userAgent);

    if (!tokens) {
      throw new BadRequestException('Не удалось обновить токен');
    }

    this.setRefreshToken(res, tokens);
  }

  @ApiOperation({
    summary: 'Выход',
    operationId: 'auth.logout',
  })
  @ApiNoContentResponse({ description: 'Успешный выход' })
  @ApiUnauthorizedResponse({ description: 'Неверный токен' })
  @ApiInternalServerErrorResponse({ description: 'Внутренняя ошибка сервера' })
  @Get('logout')
  async logout(
    @Cookie(REFRESH_TOKEN_COOKIE_NAME) refreshToken: string,
    @Res() res: Response,
  ) {
    await this.authService.deleteRefreshToken(refreshToken);

    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    res.status(HttpStatus.OK).json();
  }

  /**
   * Private method for setting refresh token into cookies
   *
   * @param {Response} res - response
   * @param {ITokens} tokens - tokens
   */
  private setRefreshToken(res: Response, tokens: ITokens) {
    if (!tokens.refreshToken) {
      throw new UnauthorizedException();
    }

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(
        add(Date.now(), {
          seconds:
            toMs(this.configService.get('jwtSettings.refreshTokenLifetime')) /
            1000,
        }),
      ),
      secure:
        this.configService.get('NODE_ENV', 'development') === 'production',
      path: '/',
    });
    res.status(HttpStatus.CREATED).json({
      accessToken: tokens.accessToken,
    });
  }
}
