import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CompanyInfoDto, UserActionDto } from 'src/common/dto/user.dto';

export type JobDocument = HydratedDocument<Job>;
@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  skills: string[];

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  salary: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  level: string;

  @Prop()
  description?: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ type: Object })
  company: CompanyInfoDto;

  @Prop({ type: Object })
  createdBy: UserActionDto;

  @Prop({ type: Object })
  updatedBy: UserActionDto;

  @Prop({ type: Object })
  deletedBy: UserActionDto;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
