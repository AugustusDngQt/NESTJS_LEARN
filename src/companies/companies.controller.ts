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

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return await this.companiesService.create(createCompanyDto);
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
  async update(@Body() updateCompanyDto: UpdateCompanyDto) {
    const company_update = await this.companiesService.update(updateCompanyDto);
    if (!company_update)
      throw new NotFoundException(CompanyMessage.COMPANY_NOT_FOUND);
    return {
      message: CompanyMessage.UPDATE_COMPANY_IS_SUCCESS,
      result: company_update,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.companiesService.remove(id);
  }
}
