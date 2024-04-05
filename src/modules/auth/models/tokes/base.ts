import { Column, Model } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

export abstract class BaseToken extends Model {
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
