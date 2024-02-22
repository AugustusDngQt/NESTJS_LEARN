import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyMessage } from 'src/constants/message.constant';
import { Model } from 'mongoose';
import { Company } from './schemas/company.schema';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/users/users.interface';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @User() user: IUser,
  ) {
    return await this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  async findAll() {
    return await this.companiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const company = await this.companiesService.findOne(id);
    if (!company) throw new NotFoundException(CompanyMessage.COMPANY_NOT_FOUND);
    return company;
  }

  @Patch()
  async update(
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser,
  ) {
    const company_update = await this.companiesService.update(
      updateCompanyDto,
      user,
    );
    if (!company_update)
      throw new NotFoundException(CompanyMessage.COMPANY_NOT_FOUND);
    return {
      message: CompanyMessage.UPDATE_COMPANY_IS_SUCCESS,
      result: company_update,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    const { deleted } = await this.companiesService.remove(id, user);
    if (deleted < 1)
      throw new NotFoundException(CompanyMessage.COMPANY_NOT_FOUND);
    return { message: CompanyMessage.DELETE_COMPANY_IS_SUCCESS };
  }
}
