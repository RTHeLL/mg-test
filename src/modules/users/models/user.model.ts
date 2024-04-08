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
  firstName: string;

  @Column
  lastName: string;

  @Column({ defaultValue: true })
  isActive: boolean;

  @Column({ defaultValue: false })
  isAdmin: boolean;
}
