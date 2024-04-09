/**
 * Interface for refresh token
 *
 * @interface IRefreshTokenInterface
 * @property {number} userId - user id
 * @property {boolean} isAdmin - user is admin
 * @property {string} jti - token id
 * @property {number} exp - expiration date in timestamp
 * @property {number} iat - issued at timestamp
 */
export interface IRefreshTokenInterface {
  userId: number;
  isAdmin: boolean;
  jti: string;
  exp: number;
  iat: number;
}
