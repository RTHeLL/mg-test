import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class IsAdminGuard implements CanActivate {
  private readonly logger = new Logger(IsAdminGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Такой подход не дает возможности налету проверить права админа,
    // так как нужно пересоздать токен.
    // Лучше сделать проверку через БД, чтобы всегда было актуально.
    const request = context.switchToHttp().getRequest();

    return request.user.isAdmin;
  }
}
