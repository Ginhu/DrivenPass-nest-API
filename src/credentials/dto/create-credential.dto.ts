import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateCredentialDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  rotulo: string;
}
