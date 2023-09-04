import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'fakemail@hostmail.com',
    description: 'email to signup or signin the application',
  })
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(10)
  @ApiProperty({
    example: 'StronGP@s5w*Rd',
    description: 'password to signup or signin in the application',
  })
  password: string;
}
