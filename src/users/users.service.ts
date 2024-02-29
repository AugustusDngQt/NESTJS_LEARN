import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CompanyMessage, UserMessage } from '../constants/message.constant';
import * as bcrypt from 'bcrypt';
import ObjectId, { isValidObjectId } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  isValidPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  async getHashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async create(payload: CreateUserDto) {
    const hash = await this.getHashPassword(payload.password);

    const user = await this.userModel.create({ ...payload, password: hash });
    return {
      result: user,
    };
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    try {
      if (!ObjectId.isValidObjectId(id))
        throw new BadRequestException(CompanyMessage.ID_IS_INVALID);
      return { result: await this.userModel.findOne({ _id: id }) };
    } catch {
      return 'Not found';
    }
  }

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({ email: username });
  }

  async update(body: UpdateUserDto) {
    try {
      if (!ObjectId.isValidObjectId(body._id)) return 'Id is invalid';
      return {
        result: await this.userModel.findOneAndUpdate(
          { _id: body._id },
          {
            $set: { ...body },
          },
          {
            returnDocument: 'after',
          },
        ),
      };
    } catch {
      return 'Not found';
    }
  }

  async remove(id: string) {
    try {
      if (!isValidObjectId(id)) return 'Id is invalid';
      const result = await this.userModel.softDelete({ _id: id });
      if (result.deleted < 1)
        throw new NotFoundException(UserMessage.USER_NOT_FOUND);
      return { result: true };
    } catch {
      return UserMessage.USER_NOT_FOUND;
    }
  }
}
