import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsISO8601,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { CompanyInfoDto } from 'src/common/dto/user.dto';
import { JobMessage } from 'src/constants/message.constant';

export class UpdateJobDto {
  @IsNotEmpty()
  _id: string;

  @IsOptional()
  @IsString({
    message: JobMessage.TITLE_OF_JOB_MUST_BE_STRING,
  })
  @Length(10, 50, {
    message: JobMessage.TITLE_LENGTH_MUST_BE_FROM_10_TO_50_CHARACTERS,
  })
  title: string;

  @IsOptional()
  @IsArray({ message: JobMessage.SKILLS_MUST_BE_ARRAY })
  @ArrayMinSize(1, {
    message: JobMessage.SKILLS_MUST_BE_ARRAY_WITH_MINIMUM_1_ITEM,
  })
  @IsOptional()
  @IsString({ each: true, message: JobMessage.SKILL_MUST_BE_STRING })
  @Length(2, 30, {
    each: true,
    message: JobMessage.SKILL_LENGTH_MUST_BE_FROM_2_TO_30_CHARACTERS,
  })
  skills: string[];

  @IsOptional()
  @IsString({
    message: JobMessage.LOCATION_OF_JOB_MUST_BE_STRING,
  })
  @Length(20, 100, {
    message: JobMessage.LOCATION_LENGTH_MUST_BE_FROM_20_TO_100_CHARACTERS,
  })
  location: string;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: JobMessage.SALARY_MUST_BE_GREATER_THAN_0 })
  salary: number;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: JobMessage.QUANTITY_MUST_BE_GREATER_THAN_0 })
  quantity: number;

  @IsOptional()
  @IsString({ message: JobMessage.LEVEL_OF_JOB_MUST_BE_STRING })
  @Length(2, 30, {
    message: JobMessage.LEVEL_LENGTH_MUST_BE_FROM_2_TO_30_CHARACTERS,
  })
  level: string;

  @IsOptional()
  @IsString({ message: JobMessage.DESCRIPTION_MUST_BE_STRING })
  @Length(20, 200, {
    message: JobMessage.DESCRIPTION_LENGTH_MUST_BE_FROM_20_TO_200_CHARACTERS,
  })
  description: string;

  @IsOptional()
  @IsISO8601({ strict: true }, { message: JobMessage.START_DATE_IS_INVALID })
  startDate: Date;

  @IsOptional()
  @IsISO8601({ strict: true }, { message: JobMessage.END_DATE_IS_INVALID })
  endDate: Date;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  company: CompanyInfoDto;
}
