import * as _ from 'lodash';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models';

import { hash, genSalt } from 'bcrypt';
import { literal, Op } from 'sequelize';
import { PageDto } from '../../common/dto';
import { plainToInstance } from 'class-transformer';

import { UserDtoResponse } from './dto';
import { IPagination } from '../../common/interfaces';
import { OrderDirectionEnum } from '../../common/enums';
import { ISearching } from '../../common/interfaces/searching.interface';

/**
 * Service for users
 */
@Injectable()
export class UsersService {
  /**
   * Constructor for UsersService class
   *
   * @param {User} userRepository - user repository
   */
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  /**
   * Method for creating new user
   *
   * @param {Partial<User>} data - data for creating new user
   * @returns {Promise<User>} - created user
   */
  async create(data: Partial<User>): Promise<User> {
    const hashedPassword = await this.hashPassword(data.password);

    if (data.email && !(await this.isUniqueEmail(data.email))) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    try {
      return await this.userRepository.create({
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    } catch (err) {
      if (err.name == 'SequelizeUniqueConstraintError') {
        throw new BadRequestException(
          'Пользователь с таким номером телефона уже существует',
        );
      }
    }
  }

  /**
   * Method for removing user
   *
   * @param {number} id - user id
   * @returns {Promise<number>} - number of deleted rows
   */
  async remove(id: number): Promise<number> {
    const count = await this.userRepository.destroy({ where: { id } });

    if (!count) {
      throw new NotFoundException('Пользователь не найден');
    }

    return count;
  }

  /**
   * Method for getting all users
   *
   * @param {IPagination} paginationParams - pagination params
   * @param {[string, OrderDirectionEnum][]} orderingParams - ordering params
   * @param {ISearching} searchingParams - searching params
   * @returns {Promise<PageDto<UserDtoResponse>>} - users
   */
  async findAll(
    paginationParams: IPagination,
    orderingParams?: [string, OrderDirectionEnum][],
    searchingParams?: ISearching,
  ): Promise<PageDto<UserDtoResponse>> {
    const whereParams = {};

    if (searchingParams?.search) {
      Object.assign(whereParams, {
        [Op.or]: searchingParams.fields.map((field) => {
          return literal(
            `CAST("${_.snakeCase(field)}" AS TEXT) ILIKE '%${searchingParams.search}%'`,
          );
        }),
      });
    }

    const { rows, count } = await this.userRepository.findAndCountAll({
      where: whereParams,
      limit: paginationParams.limit,
      offset: paginationParams.offset,
      order: orderingParams,
    });

    return new PageDto(
      plainToInstance(UserDtoResponse, rows),
      paginationParams.page,
      paginationParams.limit,
      count,
    );
  }

  /**
   * Method for getting user
   *
   * @param {number} id - user id
   * @returns {Promise<User>} - user
   */
  async findOne(id: number): Promise<User> {
    return this.userRepository.findByPk(id);
  }

  /**
   * Method for getting user by email or phone
   *
   * @param {string} emailOrPhone - email or phone number
   * @returns {Promise<User>} - user
   */
  async findOneByEmailOrPhone(emailOrPhone: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        [Op.or]: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
      },
    });
  }

  async isUniqueEmail(email: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { email: email } });
    return count == 0;
  }

  /**
   * Method for updating user
   *
   * @param {number} id - user id
   * @param {Partial<User>} data - data for updating
   * @returns {Promise<[number, User[]]>} - number of updated rows and updated rows
   */
  async update(id: number, data: Partial<User>): Promise<void> {
    await this.userRepository.update(data, {
      where: { id },
      returning: true,
    });
  }

  /**
   * Method for hashing password
   *
   * @param {string} password - password
   * @returns {Promise<string>} - hashed password
   */
  async hashPassword(password: string): Promise<string> {
    return hash(password, await genSalt(10));
  }
}
