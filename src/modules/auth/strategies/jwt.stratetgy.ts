import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

/**
 * Jwt strategy
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwtApi') {
  private readonly logger = new Logger(JwtStrategy.name);

  /**
   * Constructor for JwtStrategy
   *
   * @param {ConfigService} configService - config service
   * @param {UsersService} usersService - users service
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSettings.signingKey'),
    });
  }

  /**
   * Validate jwt
   *
   * @param {any} payload - payload
   * @returns {Promise<any>} - user
   */
  async validate(payload: any) {
    if (payload.tokenType !== 'access') {
      throw new UnauthorizedException();
    }

    // Проверка именно через БД,
    // так как если проверять просто наличие userId в payload,
    // то пользователь, который удален из БД будет иметь доступ пока не умрет токен
    const user = this.usersService.findOne(payload.userId).catch((err) => {
      this.logger.error(err);
      return null;
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
