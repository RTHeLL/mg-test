/**
 * Interface for jwt payload
 *
 * @interface IJwtPayload
 * @property {number} userId - user id
 * @property {string} tokenType - token type
 * @property {boolean} isAdmin - user is admin
 * @property {string} jti - token id
 * @property {number} exp - expiration date in timestamp
 * @property {number} iat - issued at timestamp
 */
export interface IJwtPayload {
  userId: number;
  tokenType: string;
  isAdmin: boolean;
  isActive: boolean;
  jti: string;
  iat: number;
  exp: number;
}
