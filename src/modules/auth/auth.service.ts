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
import { RefreshTokenDtoRequest } from '@auth/dto/request/refreshToken.dto.request';
import { IRefreshTokenInterface } from '@auth/interfaces/refreshToken.interface';
import { User } from '../users/models';

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
   * @returns {Promise<ITokens>} - response for authorization
   */
  async signIn(data: SignInDtoRequest): Promise<ITokens> {
    const user = await this.usersService
      .findOneForLogin(data.emailOrPhone)
      .catch((err) => {
        this.logger.error(
          `signIn: ${err}\n
          data: ${JSON.stringify(data)}\n
          message: ${err.message}`,
        );
        throw new InternalServerErrorException('Внутренняя ошибка сервера');
      });

    if (!user || !(await compare(data.password, user.password))) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const accessToken = await this.getAccessToken(user.id, user.isAdmin);
    const refreshToken = await this.getRefreshToken(user.id, user.isAdmin);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Method for refreshing tokens
   *
   * @param {RefreshTokenDtoRequest} data - data for refreshing tokens
   * @returns {Promise<ITokens>} - response for refreshing tokens
   */
  async refresh(data: RefreshTokenDtoRequest): Promise<ITokens> {
    const decodedToken = await this.decodeRefreshToken(data.refreshToken);

    // TODO: понять, почему пишет, что модель не подключена
    // const refreshToken = await this.refreshTokenRepository
    //   .findOne({ where: { tokenId: decodedToken.tokenId } })
    //   .catch((err) => {
    //     this.logger.error(err);
    //     return null;
    //   });
    //
    // if (!refreshToken) {
    //   throw new UnauthorizedException('Неверный токен обновления');
    // }

    return {
      accessToken: await this.getAccessToken(
        decodedToken.userId,
        decodedToken.isAdmin,
      ),
      refreshToken: await this.getRefreshToken(
        decodedToken.userId,
        decodedToken.isAdmin,
      ),
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
      id: userId,
      isAdmin: isAdmin,
    });
  }

  /**
   * Private method for getting refresh token
   *
   * @param {number} userId - user id
   * @param {boolean} isAdmin - user is admin
   * @returns {Promise<string>} - refresh token
   */
  private async getRefreshToken(
    userId: number,
    isAdmin: boolean,
  ): Promise<string> {
    const tokenId = v4();
    const refreshToken = await this.jwtService.signAsync(
      { userId: userId, isAdmin: isAdmin, tokenId: tokenId },
      { expiresIn: this.configService.get('jwtSettings.refreshTokenLifetime') },
    );

    // TODO: понять, почему пишет, что модель не подключена
    // await this.refreshTokenRepository
    //   .create({
    //     id: tokenId,
    //     userId: userId,
    //     token: refreshToken,
    //     exp: new Date(
    //       add(Date.now(), {
    //         seconds:
    //           toMs(this.configService.get('jwtSettings.refreshTokenLifetime')) /
    //           1000,
    //       }),
    //     ),
    //   })
    //   .catch((err) => {
    //     this.logger.error(err);
    //     return null;
    //   });

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
