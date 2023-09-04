import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Note1', description: 'Just a title to your note' })
  titulo: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Lorem Ipsum Dollor', description: 'your note here' })
  note: string;
}
