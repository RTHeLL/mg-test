import { Table } from 'sequelize-typescript';
import { BaseToken } from './base';

@Table({ tableName: 'refresh_tokens' })
export class RefreshToken extends BaseToken {}
