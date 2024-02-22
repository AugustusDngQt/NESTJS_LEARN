import { IsString, Length } from 'class-validator';
import { CompanyMessage } from 'src/constants/message.constant';

export class CreateCompanyDto {
  @IsString({
    message: CompanyMessage.NAME_OF_COMPANY_MUST_BE_STRING,
  })
  @Length(2, 30, {
    message: CompanyMessage.NAME_LENGTH_MUST_BE_FROM_2_TO_30_CHARACTERS,
  })
  name: string;

  @IsString({
    message: CompanyMessage.ADDRESS_MUST_BE_STRING,
  })
  @Length(20, 100, {
    message: CompanyMessage.ADDRESS_LENGTH_MUST_BE_FROM_20_TO_100_CHARACTERS,
  })
  address: string;

  @IsString({ message: CompanyMessage.DESCRIPTION_MUST_BE_STRING })
  @Length(20, 200, {
    message:
      CompanyMessage.DESCRIPTION_LENGTH_MUST_BE_FROM_20_TO_200_CHARACTERS,
  })
  description: string;
}
