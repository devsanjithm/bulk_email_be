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

  @IsString()
  @IsOptional()
  public email_subject: string;

  @IsString()
  @IsOptional()
  public email_from: string;

  @IsString()
  @IsOptional()
  public from_email: string;

  @IsString()
  @IsOptional()
  public url_domain: string;

  @IsString()
  @IsOptional()
  public return_path: string;

  @IsString()
  @IsOptional()
  public test_mail: string;

  @IsString()
  @IsOptional()
  public header_type: string;

  @IsString()
  @IsOptional()
  public check_mode: string;

  @IsString()
  @IsOptional()
  public creative_type: string;

  @IsString()
  @IsOptional()
  public check_process: string;

  @IsString()
  @IsOptional()
  public mode: string;

  @IsString()
  @IsOptional()
  public process: string;

  
  @IsString()
  @IsOptional()
  public check_count: string;
  
  @IsString()
  @IsOptional()
  public instance: string;
  
  @IsString()
  @IsOptional()
  public mail_content: string;

  @IsString()
  @IsOptional()
  public header_content: string;

}

export class updateUserDTO extends GetDto {}
