import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';

@Controller('notes')
@UseGuards(AuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @User() user: Users) {
    return this.notesService.create(user, createNoteDto);
  }

  @Get()
  findAll(@User() user: Users) {
    return this.notesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: Users) {
    return this.notesService.findOne(user, +id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: Users) {
    return this.notesService.remove(user, +id);
  }
}
