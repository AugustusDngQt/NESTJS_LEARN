import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CompanyMessage } from 'src/constants/message.constant';
import { isValidObjectId } from 'mongoose';
import { User } from 'src/decorators/customize.decorator';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companymodel: SoftDeleteModel<CompanyDocument>,
  ) {}
  async create(createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return {
      result: await this.companymodel.create({
        ...createCompanyDto,
        createdBy: { userId: user._id, email: user.email },
      }),
    };
  }

  async findAll(page: number, limit: number, qs: string) {
    const { filter, projection, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;

    // eslint-disable-next-line prefer-const
    let { sort }: any = aqp(qs);
    // sort dùng cho các điều kiện về sắp xếp dữ liệu
    // projection là đối tượng các trường được cần hay loại trừ
    // population dùng cho các logic như gộp...
    const defaultLimit = limit ? limit : 10;
    const offset = (page - 1) * defaultLimit;
    const totalItems = (await this.companymodel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.companymodel
      .find(filter)
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
    if (!isValidObjectId(id))
      throw new BadRequestException(CompanyMessage.ID_IS_INVALID);
    return { result: await this.companymodel.findOne({ _id: id }) };
  }

  async update(updateCompanyDto: UpdateCompanyDto, @User() user: IUser) {
    if (!isValidObjectId(updateCompanyDto._id))
      throw new BadRequestException(CompanyMessage.ID_IS_INVALID);
    return {
      result: await this.companymodel.findOneAndUpdate(
        { _id: updateCompanyDto._id },
        {
          $set: {
            ...updateCompanyDto,
            updatedBy: { userId: user._id, email: user.email },
          },
        },
        { returnDocument: 'after' },
      ),
    };
  }

  async remove(id: string, @User() user: IUser) {
    try {
      if (!isValidObjectId(id))
        throw new BadRequestException(CompanyMessage.ID_IS_INVALID);
      await this.companymodel.updateOne(
        { _id: id },
        {
          $set: {
            deletedBy: { userId: user._id, email: user.email },
          },
        },
      );
      const result = await this.companymodel.softDelete({ _id: id });
      if (result.deleted < 1)
        throw new NotFoundException(CompanyMessage.COMPANY_NOT_FOUND);
      return { result: true };
    } catch {
      return CompanyMessage.COMPANY_NOT_FOUND;
    }
  }
}
