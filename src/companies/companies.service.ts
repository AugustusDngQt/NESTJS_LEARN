import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CompanyMessage } from 'src/constants/message.constant';
import { isValidObjectId } from 'mongoose';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companymodel: SoftDeleteModel<CompanyDocument>,
  ) {}
  async create(createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return await this.companymodel.create({
      ...createCompanyDto,
      createdBy: { userId: user._id, email: user.email },
    });
  }

  async findAll() {
    return await this.companymodel.find().exec();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException(CompanyMessage.ID_IS_INVALID);
    return await this.companymodel.findOne({ _id: id });
  }

  async update(updateCompanyDto: UpdateCompanyDto, @User() user: IUser) {
    if (!isValidObjectId(updateCompanyDto._id))
      throw new BadRequestException(CompanyMessage.ID_IS_INVALID);
    return await this.companymodel.findOneAndUpdate(
      { _id: updateCompanyDto._id },
      {
        $set: {
          ...updateCompanyDto,
          updatedBy: { userId: user._id, email: user.email },
        },
      },
      { returnDocument: 'after' },
    );
  }

  async remove(id: string, @User() user: IUser) {
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
    return this.companymodel.softDelete({ _id: id });
  }
}
