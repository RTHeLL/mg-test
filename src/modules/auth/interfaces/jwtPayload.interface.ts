export interface IJwtPayload {
  userId: number;
  tokenType: string;
  isAdmin: boolean;
  jti: string;
  iat: number;
  exp: number;
}
