import { cardType } from '@prisma/client';
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
  number: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  cvc: number;

  @IsNotEmpty()
  @IsDateString()
  expirationDate: Date;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  virtual: boolean;

  @IsNotEmpty()
  @IsString()
  type: cardType;

  @IsNotEmpty()
  @IsString()
  rotulo: string;
}
