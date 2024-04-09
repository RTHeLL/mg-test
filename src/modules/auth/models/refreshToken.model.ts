import { Column, Table, Model } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

/**
 * Model for refresh tokens
 *
 * @class RefreshToken
 * @property {string} id - refresh token id
 * @property {Date} exp - expiration date
 * @property {number} userId - user id
 * @property {string} userAgent - user agent
 */
@Table({ tableName: 'refresh_tokens' })
export class RefreshToken extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id: number;

  @Column({
    type: DataTypes.STRING,
    unique: true,
  })
  jti: string;

  @Column
  exp: Date;

  @Column
  userId: number;

  @Column
  userAgent: string;
}
