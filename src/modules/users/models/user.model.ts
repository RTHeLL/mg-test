import { Column, Model, Table } from 'sequelize-typescript';

/**
 * Model for users
 *
 * @class User
 * @property {string} email - email
 * @property {string} phoneNumber - phone number
 * @property {string} password - password
 * @property {string} firstName - first name
 * @property {string} lastName - last name
 * @property {boolean} isActive - active
 * @property {boolean} isAdmin - admin
 */
@Table({ tableName: 'users' })
export class User extends Model {
  @Column({
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @Column({
    unique: true,
  })
  phoneNumber: string;

  @Column
  password: string;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column({ defaultValue: true })
  isActive: boolean;

  @Column({ defaultValue: false })
  isAdmin: boolean;
}
