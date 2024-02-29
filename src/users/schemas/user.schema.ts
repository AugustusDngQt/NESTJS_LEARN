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
  date_of_birth: Date;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  address: string;

  @Prop({ type: Object })
  company: CompanyInfoDto;

  @Prop({ required: true })
  gender: string;

  @Prop()
  forgot_password_token: string;

  @Prop()
  verify_email_token: string;

  @Prop({ default: UserVerifyStatus.Unverified })
  verify_status: UserVerifyStatus;

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
}

export const UserSchema = SchemaFactory.createForClass(User);
