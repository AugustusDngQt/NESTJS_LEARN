import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage } from 'src/decorators/customize.decorator';
import { UserMessage } from 'src/constants/message.constant';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @ResponseMessage(UserMessage.CREATE_USER_IS_SUCCESS)
  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException(UserMessage.USER_NOT_FOUND);
    return user;
  }

  @Patch()
  @ResponseMessage(UserMessage.UPDATE_USER_IS_SUCCESS)
  async update(@Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  @ResponseMessage(UserMessage.DELETE_USER_IS_SUCCESS)
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
