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
import { IUser } from './users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  async updateRefreshToken(_id: string, refreshToken: string) {
    return await this.userModel.updateOne(
      { _id },
      {
        $set: { refreshToken: refreshToken !== '' ? refreshToken : null },
        $currentDate: { updatedAt: true },
      },
    );
  }

  isValidPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  async getHashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async create(payload: CreateUserDto, user: IUser) {
    const hash = await this.getHashPassword(payload.password);
    if (await this.userModel.findOne({ email: payload.email }))
      throw new BadRequestException(UserMessage.EMAIL_IS_ALREADY_EXISTS);
    const result = await this.userModel.create({
      ...payload,
      password: hash,
      role: 'ADMIN',
      createdBy: {
        userId: new mongoose.Types.ObjectId(user._id),
        email: user.email,
      },
    });
    return {
      result: { _id: result._id, createdAt: result.createdAt },
    };
  }

  async findAll(page: number, limit: number, qs: string) {
    const { filter, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    // eslint-disable-next-line prefer-const
    let { sort }: any = aqp(qs);

    const defaultLimit = limit ? limit : 10;
    const offset = (page - 1) * defaultLimit;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter, { password: 0 })
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .exec();
    return {
      meta: {
        currentPage: page, //trang hiện tại
        pageSize: defaultLimit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    if (!ObjectId.isValidObjectId(id))
      throw new BadRequestException(CompanyMessage.ID_IS_INVALID);
    return {
      result: await this.userModel.findOne({ _id: id }, { password: 0 }),
    };
  }

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({ email: username });
  }

  async update(body: UpdateUserDto, user: IUser) {
    try {
      if (!isValidObjectId(body._id))
        throw new BadRequestException(UserMessage.ID_IS_INVALID);
      return {
        result: await this.userModel.updateOne(
          { _id: body._id },
          {
            $set: {
              ...body,
              updatedBy: {
                userId: new mongoose.Types.ObjectId(user._id),
                email: user.email,
              },
            },
          },
        ),
      };
    } catch {
      return 'Not found';
    }
  }

  async remove(id: string, user: IUser) {
    try {
      if (!isValidObjectId(id))
        throw new BadRequestException(UserMessage.ID_IS_INVALID);
      await this.userModel.updateOne(
        { _id: id },
        {
          $set: {
            deletedBy: {
              userId: new mongoose.Types.ObjectId(user._id),
              email: user.email,
            },
          },
        },
      );
      const result = await this.userModel.softDelete({ _id: id });
      if (result.deleted < 1)
        throw new NotFoundException(UserMessage.USER_NOT_FOUND);
      return { result: { deleted: result.deleted } };
    } catch {
      return UserMessage.USER_NOT_FOUND;
    }
  }
}
