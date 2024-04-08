import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

// TODO: доделать
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
  async validate(payload: any) {
    const user = this.usersService
      .findOneForLogin(payload.username)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    if (!user) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
