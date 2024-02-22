import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserMessage } from 'src/constants/message.constant';

export class UserActionDto {
  @IsNotEmpty({ message: UserMessage.USER_ID_IS_NOT_EMPTY })
  @IsString({
    message: UserMessage.USER_ID_OF_USER_MUST_BE_STRING,
  })
  userId: string;

  @IsNotEmpty({ message: UserMessage.EMAIL_IS_NOT_EMPTY })
  @IsEmail({}, { message: UserMessage.EMAIL_IS_INVALID })
  email: string;
}
