import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserMessage } from './constants/message.constant';
import * as bcrypt from 'bcrypt';
import ObjectId from 'mongoose';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getHashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async create(payload: CreateUserDto) {
    const hash = await this.getHashPassword(payload.password);
    const user = await this.userModel.create({ ...payload, password: hash });
    return {
      message: UserMessage.CREATE_USER_IS_SUCCESS,
      user,
    };
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    try {
      if (!ObjectId.isValidObjectId(id)) return 'Id is invalid';
      return await this.userModel.findOne({ _id: id });
    } catch {
      return 'Not found';
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
