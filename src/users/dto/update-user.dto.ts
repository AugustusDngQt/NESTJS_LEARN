import { UserGender } from '../../constants/enums.constant';
import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { UserMessage } from '../../constants/message.constant';
import { CompanyInfoDto } from 'src/common/dto/user.dto';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsNotEmpty()
  _id: string;

  @IsOptional()
  @IsString({
    message: UserMessage.NAME_OF_USER_MUST_BE_STRING,
  })
  @Length(2, 30, {
    message: UserMessage.NAME_LENGTH_MUST_BE_FROM_2_TO_30_CHARACTERS,
  })
  name?: string;

  @IsOptional()
  @IsISO8601(
    { strict: true, strictSeparator: true },
    { message: UserMessage.DATE_OF_BIRTH_IS_INVALID },
  )
  dateOfBirth?: Date;

  @IsOptional()
  @IsEmail({}, { message: UserMessage.EMAIL_IS_INVALID })
  email?: string;

  @IsOptional()
  @IsPhoneNumber('VN', {
    message:
      UserMessage.THE_PHONE_NUBER_MUST_BE_A_VALID_VIETNAMESE_PHONE_NUMBER,
  })
  phoneNumber?: string;

  @IsOptional()
  @IsString({ message: UserMessage.ADDRESS_OF_USER_MUST_BE_STRING })
  @Length(20, 100, {
    message: UserMessage.ADDRESS_LENGTH_MUST_BE_FROM_20_TO_100_CHARACTERS,
  })
  address?: string;

  @IsOptional()
  @IsString({ message: UserMessage.PASSWORD_OF_USER_MUST_BE_STRING })
  @IsEmpty({
    message:
      UserMessage.USERS_CAN_CHANGE_THEIR_PASSWORD_EXCLUSIVELY_THROUGH_THE_PASSWORD_CHANGE_FEATURE,
  })
  password?: string;

  @IsOptional()
  @IsEnum(UserGender)
  gender?: string;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CompanyInfoDto)
  company?: CompanyInfoDto;
}
