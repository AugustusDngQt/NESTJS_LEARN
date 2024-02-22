import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserActionDto } from 'src/common/dto/user-action.dto';

export type CompanyDocument = HydratedDocument<Company>;
@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  createdBy: UserActionDto;

  @Prop()
  updatedBy: UserActionDto;

  @Prop()
  deletedBy: UserActionDto;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
