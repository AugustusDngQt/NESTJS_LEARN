import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsISO8601,
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

export class CreateJobDto {
  @IsString({
    message: JobMessage.TITLE_OF_JOB_MUST_BE_STRING,
  })
  @Length(10, 50, {
    message: JobMessage.TITLE_LENGTH_MUST_BE_FROM_10_TO_50_CHARACTERS,
  })
  title: string;

  @IsArray({ message: JobMessage.SKILLS_MUST_BE_ARRAY })
  @ArrayMinSize(1, {
    message: JobMessage.SKILLS_MUST_BE_ARRAY_WITH_MINIMUM_1_ITEM,
  })
  @IsString({ each: true, message: JobMessage.SKILL_MUST_BE_STRING })
  @Length(2, 30, {
    each: true,
    message: JobMessage.SKILL_LENGTH_MUST_BE_FROM_2_TO_30_CHARACTERS,
  })
  skills: string[];

  @IsString({
    message: JobMessage.LOCATION_OF_JOB_MUST_BE_STRING,
  })
  @Length(20, 100, {
    message: JobMessage.LOCATION_LENGTH_MUST_BE_FROM_20_TO_100_CHARACTERS,
  })
  location: string;

  @IsNumber()
  @Min(1, { message: JobMessage.SALARY_MUST_BE_GREATER_THAN_0 })
  salary: number;

  @IsNumber()
  @Min(1, { message: JobMessage.QUANTITY_MUST_BE_GREATER_THAN_0 })
  quantity: number;

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

  @IsISO8601({ strict: true }, { message: JobMessage.START_DATE_IS_INVALID })
  startDate: Date;

  @IsISO8601({ strict: true }, { message: JobMessage.END_DATE_IS_INVALID })
  endDate: Date;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CompanyInfoDto)
  company: CompanyInfoDto;
}
