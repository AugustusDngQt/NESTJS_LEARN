import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Res,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ResponseMessage, User } from 'src/decorators/customize.decorator';
import { IUser } from 'src/users/users.interface';
import { JobMessage } from 'src/constants/message.constant';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ResponseMessage(JobMessage.CREATE_JOB_IS_SUCCESS)
  async create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return await this.jobsService.create(createJobDto, user);
  }

  @Get()
  findAll(
    @Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.jobsService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const job = await this.jobsService.findOne(id);
    if (!job) throw new NotFoundException(JobMessage.JOB_NOT_FOUND);
    return { result: job };
  }

  @Patch()
  @ResponseMessage(JobMessage.UPDATE_JOB_IS_SUCCESS)
  update(@Body() updateJobDto: UpdateJobDto, @User() user: IUser) {
    return this.jobsService.update(updateJobDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }
}
