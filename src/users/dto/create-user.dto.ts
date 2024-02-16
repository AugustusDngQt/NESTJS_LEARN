import { UserGender } from '../constants/enums.constant';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { UserMessage } from '../constants/message.constant';

export class CreateUserDto {
  @IsString({
    message: UserMessage.NAME_OF_USER_MUST_BE_STRING,
  })
  @Length(2, 30, {
    message: UserMessage.NAME_LENGTH_MUST_BE_FROM_2_TO_30_CHARACTERS,
  })
  name: string;
  @IsInt({ message: UserMessage.AGE_OF_USER_MUST_BE_INTEGER_NUMBER })
  age: number;
  @IsEmail({}, { message: UserMessage.EMAIL_IS_INVALID })
  email: string;
  @IsPhoneNumber('VI', {
    message:
      UserMessage.THE_PHONE_NUBER_MUST_BE_A_VALID_VIETNAMESE_PHONE_NUMBER,
  })
  phone: string;
  @IsString({ message: UserMessage.PASSWORD_OF_USER_MUST_BE_STRING })
  password: string;
  @IsString({ message: UserMessage.ADDRESS_OF_USER_MUST_BE_STRING })
  @Length(20, 100, {
    message: UserMessage.ADDRESS_LENGTH_MUST_BE_FROM_20_TO_100_CHARACTERS,
  })
  address: string;
  @IsEnum(UserGender, {
    message: UserMessage.GENDER_MUST_BE_ONE_OF_MALE_FEMALE_OTHER,
  })
  gender: UserGender;
}
