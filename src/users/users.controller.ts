import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage, User } from 'src/decorators/customize.decorator';
import { UserMessage } from 'src/constants/message.constant';
import { IUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ResponseMessage(UserMessage.CREATE_USER_IS_SUCCESS)
  @Post()
  async create(@Body() body: CreateUserDto, @User() user: IUser) {
    return await this.usersService.create(body, user);
  }

  @Get()
  findAll(
    @Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException(UserMessage.USER_NOT_FOUND);
    return user;
  }

  @Patch()
  @ResponseMessage(UserMessage.UPDATE_USER_IS_SUCCESS)
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return await this.usersService.update(updateUserDto, user);
  }

  @Delete(':id')
  @ResponseMessage(UserMessage.DELETE_USER_IS_SUCCESS)
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.usersService.remove(id, user);
  }
}
