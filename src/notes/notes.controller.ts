import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('notes')
@UseGuards(AuthGuard)
@ApiTags('Notes')
@ApiBearerAuth()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Post a new note' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Note was created' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Missing information on the request',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Trying to create a note that already exists',
  })
  create(@Body() createNoteDto: CreateNoteDto, @User() user: Users) {
    return this.notesService.create(user, createNoteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user notes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Got all the user registered notes information',
  })
  findAll(@User() user: Users) {
    return this.notesService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user specific note' })
  @ApiParam({ name: 'id', description: 'note id', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Got user note information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'There is no note registered with the provided id',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Trying to access another user note - Forbidden',
  })
  findOne(@Param('id') id: string, @User() user: Users) {
    return this.notesService.findOne(user, +id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user specific note' })
  @ApiParam({ name: 'id', description: 'note id', example: 1 })
  remove(@Param('id') id: string, @User() user: Users) {
    return this.notesService.remove(user, +id);
  }
}
