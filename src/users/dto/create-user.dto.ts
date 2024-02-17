import { UserGender } from '../constants/enums.constant';
import {
  IsEmail,
  IsEnum,
  IsISO8601,
  IsIn,
  IsInt,
  IsNumber,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { UserMessage } from '../constants/message.constant';
import { PasswordMatch } from '../decorators/password-match.decorator';
import { IsEnumNumber } from '../decorators/is-enum-number.decorator';
import { getArrayNumberEnum } from '../utils/others.util';

export class CreateUserDto {
  @IsString({
    message: UserMessage.NAME_OF_USER_MUST_BE_STRING,
  })
  @Length(2, 30, {
    message: UserMessage.NAME_LENGTH_MUST_BE_FROM_2_TO_30_CHARACTERS,
  })
  name: string;

  @IsISO8601(
    { strict: true, strictSeparator: true },
    { message: UserMessage.DATE_OF_BIRTH_IS_INVALID },
  )
  date_of_birth: Date;

  @IsEmail({}, { message: UserMessage.EMAIL_IS_INVALID })
  email: string;

  @IsPhoneNumber('VN', {
    message:
      UserMessage.THE_PHONE_NUBER_MUST_BE_A_VALID_VIETNAMESE_PHONE_NUMBER,
  })
  phone: string;

  @IsString({ message: UserMessage.PASSWORD_OF_USER_MUST_BE_STRING })
  password: string;

  @IsString({ message: UserMessage.CONFIRM_PASSWORD_MUST_BE_STRING })
  @PasswordMatch('password', {
    message: UserMessage.CONFIRM_PASSWORD_MUST_BE_SAME_WITH_PASSWORD,
  })
  confirm_password: string;

  @IsString({ message: UserMessage.ADDRESS_OF_USER_MUST_BE_STRING })
  @Length(20, 100, {
    message: UserMessage.ADDRESS_LENGTH_MUST_BE_FROM_20_TO_100_CHARACTERS,
  })
  address: string;

  @IsEnum(UserGender)
  gender: string;
}
