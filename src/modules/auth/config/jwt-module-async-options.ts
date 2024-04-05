import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

const jwtModuleOptions = (config: ConfigService): JwtModuleOptions => ({
  global: true,
  secret: config.get('jwtSettings.signingKey'),
  signOptions: {
    expiresIn: config.get('jwtSettings.accessTokenLifetime', '5m'),
  },
});

export const jwtOptions = (): JwtModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => jwtModuleOptions(config),
});
