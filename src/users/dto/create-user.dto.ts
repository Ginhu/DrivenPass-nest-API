import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(10)
  password: string;
}
