import { Column, Model, Table } from 'sequelize-typescript';

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
  registrationDate: Date;

  @Column
  firstName: string;

  @Column
  lastName: string;
}
