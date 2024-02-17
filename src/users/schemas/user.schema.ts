import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserGender, UserVerifyStatus } from '../constants/enums.constant';

export type UserDocument = HydratedDocument<User>;
const date = new Date();
@Schema()
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

  @Prop({ default: date })
  created_at: Date;

  @Prop({ default: date })
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
