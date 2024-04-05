import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models';

import { hash, genSalt } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async create(data: Partial<User>) {
    const hashedPassword = await this.hashPassword(data.password);

    await this.userRepository.create({
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      registrationDate: new Date(),
    });

    return data;
  }

  async findAll() {
    return this.userRepository.findAll();
  }

  async findOne(id: number) {
    return this.userRepository.findByPk(id);
  }

  async findOneForLogin(emailOrPhone: string) {
    return this.userRepository.findOne({
      where: { $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }] },
    });
  }

  async hashPassword(password: string) {
    return hash(password, await genSalt(10));
  }
}
