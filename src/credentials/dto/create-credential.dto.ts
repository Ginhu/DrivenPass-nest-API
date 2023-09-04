import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateCredentialDto {
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    example: 'https://facibuuks.com',
    description: 'the site url you want to save your login infos',
  })
  url: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'myLogin',
    description: 'the login information you want to save on the app',
  })
  login: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'MyfacibuuksPw',
    description: 'your password to login on the site',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'FaciBuuks',
    description: 'Just a label to recognize this information on the app',
  })
  rotulo: string;
}
