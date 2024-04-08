import { Column, Table, Model } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

/**
 * Model for refresh tokens
 *
 * @class RefreshToken
 * @property {string} id - refresh token uuid
 * @property {string} token - refresh token
 * @property {Date} exp - expiration date
 * @property {number} userId - user id
 * @property {string} userAgent - user agent
 */
@Table({ tableName: 'refresh_tokens' })
export class RefreshToken extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  id: string;

  @Column
  token: string;

  @Column
  exp: Date;

  @Column
  userId: number;

  @Column
  userAgent: string;
}
