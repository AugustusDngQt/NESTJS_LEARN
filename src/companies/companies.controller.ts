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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyMessage } from 'src/constants/message.constant';
import { ResponseMessage, User } from 'src/decorators/customize.decorator';
import { IUser } from 'src/users/users.interface';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ResponseMessage(CompanyMessage.CREATE_COMPANY_IS_SUCCESS)
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @User() user: IUser,
  ) {
    return await this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  async findAll(
    @Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return await this.companiesService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const company = await this.companiesService.findOne(id);
    if (!company) throw new NotFoundException(CompanyMessage.COMPANY_NOT_FOUND);
    return company;
  }

  @Patch()
  @ResponseMessage(CompanyMessage.UPDATE_COMPANY_IS_SUCCESS)
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
  @ResponseMessage(CompanyMessage.DELETE_COMPANY_IS_SUCCESS)
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.companiesService.remove(id, user);
  }
}
