import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: '1111222233334444', description: 'card number' })
  number: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Fake Name Johnson',
    description: 'the name printed in the card',
  })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: '123', description: 'your card security code' })
  cvc: number;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    example: '2011-10-10T14:48:00',
    description: 'expiration date on your card',
  })
  expirationDate: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '5761', description: 'you card password' })
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: true, description: 'if you card is virtual' })
  virtual: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Credito', description: 'What type of card it is' })
  type: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'My Visa Card',
    description: 'Just a label to recognize your card on our app',
  })
  rotulo: string;
}
