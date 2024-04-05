import { Table } from 'sequelize-typescript';
import { BaseToken } from './base';

@Table({ tableName: 'access_tokens' })
export class AccessToken extends BaseToken {}
