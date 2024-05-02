import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AUTH_STRATEGIES } from './strategies';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtOptions } from './config';
import { UsersService } from '../users/users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RefreshToken } from './models';
import { GUARDS } from '@auth/guards';

/**
 * Module for authorization and authentication
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync(jwtOptions()),
    SequelizeModule.forFeature([RefreshToken]),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, UsersService, ...AUTH_STRATEGIES, ...GUARDS],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
