import { JwtAuthGuard } from '@auth/guards/jwtAuth.guard';
import { IsAdminGuard } from '@auth/guards/isAdmin.guard';

export * from './jwtAuth.guard';
export * from './isAdmin.guard';

export const GUARDS = [JwtAuthGuard, IsAdminGuard];
