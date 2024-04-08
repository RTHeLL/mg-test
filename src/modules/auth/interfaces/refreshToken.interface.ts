/**
 * Interface for refresh token
 *
 * @interface IRefreshTokenInterface
 * @property {number} userId - user id
 * @property {boolean} isAdmin - user is admin
 * @property {string} tokenId - token uuid
 * @property {number} exp - expiration date in timestamp
 * @property {number} iat - issued at timestamp
 */
export interface IRefreshTokenInterface {
  userId: number;
  isAdmin: boolean;
  tokenId: string;
  exp: number;
  iat: number;
}
