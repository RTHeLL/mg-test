import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignUpDtoRequest, SignInDtoRequest } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ITokens } from '@auth/interfaces';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import { RefreshToken } from './models';
import { InjectModel } from '@nestjs/sequelize';
import { toMs } from 'ms-typescript';
import { add } from 'date-fns';
import { IRefreshTokenInterface } from '@auth/interfaces/refreshToken.interface';
import { User } from '../users/models';
import uuidToHex = require('uuid-to-hex');

/**
 * Service for authorization and authentication
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  /**
   * Constructor for AuthService class
   *
   * @param {ConfigService} configService - config service
   * @param {UsersService} usersService - users service
   * @param {jwtService} jwtService - jwt service
   * @param {RefreshToken} refreshTokenRepository - refresh token repository
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(RefreshToken)
    private readonly refreshTokenRepository: typeof RefreshToken,
  ) {}

  /**
   * Method for creating new user
   *
   * @param {SignUpDtoRequest} data - data for creating new user
   * @returns {Promise<SignUpDtoResponse>} - response for creating new user
   */
  async signUp(data: SignUpDtoRequest): Promise<User> {
    return await this.usersService.create(data);
  }

  /**
   * Method for authorization
   *
   * @param {SignInDtoRequest} data - data for authorization
   * @param {string} userAgent - user agent
   * @returns {Promise<ITokens>} - response for authorization
   */
  async signIn(data: SignInDtoRequest, userAgent: string): Promise<ITokens> {
    const user = await this.usersService
      .findOneForLogin(data.emailOrPhone)
      .catch((err) => {
        this.logger.error(
          `signIn: ${err}\n
          userAgent: ${userAgent}\n
          data: ${JSON.stringify(data)}\n
          message: ${err.message}`,
        );
        throw new InternalServerErrorException('Внутренняя ошибка сервера');
      });

    if (!user || !(await compare(data.password, user.password))) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    return await this.getTokens(user.id, user.isAdmin, userAgent);
  }

  /**
   * Method for refreshing tokens
   *
   * @returns {Promise<ITokens>} - response for refreshing tokens
   * @param {string} refreshToken - refresh token
   * @param {string} userAgent - user agent
   */
  async refresh(refreshToken: string, userAgent: string): Promise<ITokens> {
    const decodedToken = await this.decodeRefreshToken(refreshToken);

    const refreshTokenObj = await this.refreshTokenRepository
      .findOne({ where: { jti: decodedToken.jti } })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    await this.refreshTokenRepository.destroy({
      where: { jti: decodedToken.jti },
    });

    if (!refreshTokenObj || new Date(refreshTokenObj.exp) < new Date()) {
      throw new UnauthorizedException();
    }

    return await this.getTokens(
      decodedToken.userId,
      decodedToken.isAdmin,
      userAgent,
    );
  }

  private async getTokens(
    userId: number,
    isAdmin: boolean,
    userAgent: string,
  ): Promise<ITokens> {
    const accessToken = await this.getAccessToken(userId, isAdmin);
    const refreshToken = await this.getRefreshToken(userId, isAdmin, userAgent);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Private method for getting access token
   *
   * @param {number} userId - user id
   * @param {boolean} isAdmin - user is admin
   * @returns {Promise<string>} - access token
   */
  private async getAccessToken(
    userId: number,
    isAdmin: boolean,
  ): Promise<string> {
    return await this.jwtService.signAsync({
      tokenType: 'access',
      id: userId,
      isAdmin: isAdmin,
    });
  }

  /**
   * Private method for getting refresh token
   *
   * @param {number} userId - user id
   * @param {boolean} isAdmin - user is admin
   * @param {string} userAgent - user agent
   * @returns {Promise<string>} - refresh token
   */
  private async getRefreshToken(
    userId: number,
    isAdmin: boolean,
    userAgent: string,
  ): Promise<string> {
    const jti = uuidToHex(v4());

    const refreshToken = await this.jwtService.signAsync(
      {
        tokenType: 'refresh',
        userId: userId,
        isAdmin: isAdmin,
        jti: jti,
      },
      {
        expiresIn: this.configService.get('jwtSettings.refreshTokenLifetime'),
      },
    );

    const refreshTokenObj = await this.refreshTokenRepository
      .findOne({ where: { userId: userId, userAgent: userAgent } })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    if (refreshTokenObj) {
      await this.refreshTokenRepository
        .update(
          {
            jti: jti,
            token: refreshToken,
            exp: new Date(
              add(Date.now(), {
                seconds:
                  toMs(
                    this.configService.get('jwtSettings.refreshTokenLifetime'),
                  ) / 1000,
              }),
            ),
          },
          { where: { id: refreshTokenObj.id } },
        )
        .catch((err) => {
          this.logger.error(err);
          return null;
        });
    } else {
      await this.refreshTokenRepository
        .create({
          jti: jti,
          token: refreshToken,
          userId: userId,
          userAgent: userAgent,
          exp: new Date(
            add(Date.now(), {
              seconds:
                toMs(
                  this.configService.get('jwtSettings.refreshTokenLifetime'),
                ) / 1000,
            }),
          ),
        })
        .catch((err) => {
          this.logger.error(err);
          return null;
        });
    }

    return refreshToken;
  }

  /**
   * Private method for decoding refresh token
   *
   * @param {string} token - refresh token
   * @returns {Promise<IRefreshTokenInterface>} - decoded refresh token
   */
  private async decodeRefreshToken(
    token: string,
  ): Promise<IRefreshTokenInterface> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException('Неверный токен обновления');
    }
  }
}
