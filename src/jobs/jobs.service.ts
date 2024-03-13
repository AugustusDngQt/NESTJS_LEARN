import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDocument } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import { Error } from 'mongoose';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>,
  ) {}
  async create(createJobDto: CreateJobDto, user: IUser) {
    const job = await this.jobModel.create({
      ...createJobDto,
      createdBy: { userId: user._id, email: user.email },
    });
    return {
      result: job,
    };
  }

  async findAll(page: number, limit: number, qs: string) {
    const { filter, population, projection } = aqp(qs);
    const { sort }: any = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const defaultLimit = limit ? limit : 10;
    const totalItems = (await this.jobModel.find(filter).countDocuments()) || 0;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const offset = page > 1 ? (page - 1) * defaultLimit : 0;

    const jobs = await this.jobModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .exec();

    return {
      result: jobs,
      meta: {
        currentPage: page,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems,
      },
    };
  }

  async findOne(id: string) {
    return await this.jobModel.findById(id).exec();
  }

  async update(updateJobDto: UpdateJobDto, user: IUser) {
    const jobUpdated = await this.jobModel.findOneAndUpdate(
      { _id: updateJobDto._id },
      {
        $set: {
          ...updateJobDto,
          updatedBy: { userId: user._id, email: user.email },
        },
        $currentDate: { updatedAt: true },
      },
      { returnDocument: 'after' },
    );
    return { result: jobUpdated };
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
