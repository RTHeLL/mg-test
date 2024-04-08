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

/**
 * Module for authorization and authentication
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync(jwtOptions()),
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([RefreshToken]),
  ],
  providers: [AuthService, UsersService, ...AUTH_STRATEGIES],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
