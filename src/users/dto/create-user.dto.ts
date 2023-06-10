import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
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
  @IsNotEmpty()
  public location: string;
}

export class updateUserDTO extends GetDto {}
