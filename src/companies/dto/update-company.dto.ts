import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { CompanyMessage } from '../../constants/message.constant';

export class UpdateCompanyDto {
  @IsNotEmpty()
  _id: string;

  @IsOptional()
  @IsString({
    message: CompanyMessage.NAME_OF_COMPANY_MUST_BE_STRING,
  })
  @Length(2, 30, {
    message: CompanyMessage.NAME_LENGTH_MUST_BE_FROM_2_TO_30_CHARACTERS,
  })
  name?: string;

  @IsOptional()
  @IsString({ message: CompanyMessage.ADDRESS_MUST_BE_STRING })
  @Length(20, 100, {
    message: CompanyMessage.ADDRESS_LENGTH_MUST_BE_FROM_20_TO_100_CHARACTERS,
  })
  address?: string;

  @IsOptional()
  @IsString({ message: CompanyMessage.DESCRIPTION_MUST_BE_STRING })
  @Length(20, 100, {
    message:
      CompanyMessage.DESCRIPTION_LENGTH_MUST_BE_FROM_20_TO_200_CHARACTERS,
  })
  description?: string;
}
