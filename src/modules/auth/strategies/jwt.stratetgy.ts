import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { IJwtPayload } from '@auth/interfaces/jwtPayload.interface';

/**
 * Jwt strategy
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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
  async validate(payload: IJwtPayload) {
    // Данный подход проверки активности пользователя имеет свой недостаток,
    // потому что если отключить аккаунт, то нужно ждать перегенерации токена
    if (
      payload.tokenType !== 'access' ||
      !payload?.userId ||
      !payload?.isActive
    ) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
