import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GetDto } from 'src/helpers/objectParser';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public firstname: string;

  @IsString()
  @IsNotEmpty()
  public lastname: string;

  @IsEmail()
  @IsNotEmpty()
  public email_address: string;

  @IsString()
  @IsOptional()
  public location?: string;
}

export class CreateJobDTO {

  @IsNotEmpty()
  @Type(() => CreateUserDto)
  @ValidateNested()
  public user_data: Array<CreateUserDto>;

  @IsString()
  @IsNotEmpty()
  public job_id: string;
}

export class updateUserDTO extends GetDto {}
