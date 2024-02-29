import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { CompanyMessage, UserMessage } from 'src/constants/message.constant';

export class UserActionDto {
  @IsNotEmpty({ message: UserMessage.USER_ID_IS_NOT_EMPTY })
  @IsString({
    message: UserMessage.USER_ID_OF_USER_MUST_BE_STRING,
  })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: UserMessage.EMAIL_IS_NOT_EMPTY })
  @IsEmail({}, { message: UserMessage.EMAIL_IS_INVALID })
  email: string;
}

export class CompanyInfoDto {
  @IsNotEmpty({ message: UserMessage.COMPANY_ID_IS_NOT_EMPTY })
  @IsString({
    message: UserMessage.COMPANY_ID_IS_INVALID,
  })
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: UserMessage.COMPANY_NAME_IS_NOT_EMPTY })
  @IsString({
    message: UserMessage.COMPANY_NAME_MUST_BE_STRING,
  })
  name: string;
}
