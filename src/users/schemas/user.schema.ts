import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserVerifyStatus } from '../../constants/enums.constant';
import { CompanyInfoDto, UserActionDto } from 'src/common/dto/user.dto';

export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  address: string;

  @Prop({ type: Object })
  company: CompanyInfoDto;

  @Prop({ required: true })
  gender: string;

  @Prop()
  forgotPasswordToken: string;

  @Prop()
  verifyEmailToken: string;

  @Prop({ default: UserVerifyStatus.Unverified })
  verifyStatus: UserVerifyStatus;

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

export const UserSchema = SchemaFactory.createForClass(User);
