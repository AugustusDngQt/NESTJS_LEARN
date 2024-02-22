import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserVerifyStatus } from '../../constants/enums.constant';
import { UserActionDto } from 'src/common/dto/user-action.dto';

export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date_of_birth: Date;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  gender: string;

  @Prop()
  forgot_password_token: string;

  @Prop()
  verify_email_token: string;

  @Prop({ default: UserVerifyStatus.Unverified })
  verify_status: UserVerifyStatus;

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

export const UserSchema = SchemaFactory.createForClass(User);
