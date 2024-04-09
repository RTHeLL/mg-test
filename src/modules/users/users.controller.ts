import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Post,
  Body,
  Patch,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserDtoResponse } from './dto';
import { plainToInstance } from 'class-transformer';
import { ApiOkPaginatedResponse } from '../../common/decorators/apiPaginatedResponse.decorator';
import { Pagination } from '../../common/decorators/pagination.decorator';
import { IPagination } from '../../common/interfaces';
import { Ordering } from '../../common/decorators/ordering.decorator';
import { OrderDirectionEnum } from '../../common/enums';
import { Searching } from '../../common/decorators/searching.decorator';
import { ISearching } from '../../common/interfaces/searching.interface';
import { IsAdminGuard } from '@auth/guards/isAdmin.guard';
import { CreateUserDtoRequest } from './dto';
import { UpdateUserDtoRequest } from './dto';
import { PageDto } from '../../common/dto';
import { JwtAuthGuard } from '@auth/guards';

/**
 * Controller for users
 */
@ApiTags('Пользователи')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Method for creating new user
   *
   * @fires UsersService#create - method for creating new user
   * @param {CreateUserDtoRequest} data - data for creating new user
   * @return {Promise<UserDtoResponse>} - new user
   */
  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiCreatedResponse({ type: UserDtoResponse })
  @ApiBadRequestResponse({ description: 'Некорректные данные' })
  @UseGuards(IsAdminGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() data: CreateUserDtoRequest): Promise<UserDtoResponse> {
    const user = await this.usersService.create(data);
    return plainToInstance(UserDtoResponse, user);
  }

  /**
   * Method for getting one user
   *
   * @fires UsersService#findOne - method for getting one user
   * @param {number} id - user id
   * @return {Promise<UserDtoResponse>} - user
   */
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiOkResponse({ type: UserDtoResponse })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  @ApiBearerAuth()
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: string,
  ): Promise<UserDtoResponse> {
    const user = await this.usersService.findOne(+id);

    return plainToInstance(UserDtoResponse, user);
  }

  /**
   * Method for getting list of users
   *
   * @fires UsersService#findAll - method for getting list of users
   * @param paginationParams - pagination
   * @param orderingParams - ordering
   * @param searchingParams - searching
   * @return {Promise<PageDto<UserDtoResponse>>} - list of users
   */
  @ApiOperation({ summary: 'Получить список пользователей' })
  @ApiOkPaginatedResponse(UserDtoResponse, {
    description: 'Список пользователей',
  })
  @ApiBearerAuth()
  @Get()
  async findAll(
    @Pagination() paginationParams: IPagination,
    @Ordering() orderingParams: [string, OrderDirectionEnum][],
    @Searching(['firstName', 'lastName', 'email', 'phoneNumber'])
    searchingParams: ISearching,
  ): Promise<PageDto<UserDtoResponse>> {
    return this.usersService.findAll(
      paginationParams,
      orderingParams,
      searchingParams,
    );
  }

  /**
   * Method for updating user
   *
   * @fires UsersService#update - method for updating user
   * @param id - user id
   * @param data - data for updating
   * @return {Promise<void>}
   */
  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiNoContentResponse({ description: 'Пользователь обновлен' })
  @ApiBadRequestResponse({ description: 'Некорректные данные' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  @ApiBearerAuth()
  // @UseGuards(IsOwnerGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDtoRequest,
  ): Promise<void> {
    await this.usersService.update(+id, data);
  }

  /**
   * Method for removing user
   *
   * @fires UsersService#remove - method for removing user
   * @param id - user id
   * @return {Promise<void>}
   */
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiNoContentResponse({ description: 'Пользователь удален' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  @ApiBearerAuth()
  @UseGuards(IsAdminGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.remove(+id);
  }
}
