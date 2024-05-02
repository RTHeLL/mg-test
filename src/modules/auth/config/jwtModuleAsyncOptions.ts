import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

/**
 * Module options for jwt
 *
 * @param {ConfigService} config - config service
 * @returns {JwtModuleOptions} - options for jwt
 */
const jwtModuleOptions = (config: ConfigService): JwtModuleOptions => ({
  global: true,
  secret: config.get('jwtSettings.signingKey'),
  signOptions: {
    expiresIn: config.get('jwtSettings.accessTokenLifetime', '5m'),
  },
});

/**
 * Module options for jwt with injection of config
 *
 * @returns {JwtModuleAsyncOptions} - options for jwt
 */
export const jwtOptions = (): JwtModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => jwtModuleOptions(config),
});
