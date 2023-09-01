import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { Users } from '@prisma/client';
import { NotesRepository } from './notes.repository';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}
  async create(user: Users, createNoteDto: CreateNoteDto) {
    const note = await this.notesRepository.findNoteByTituloAndUseId(
      user,
      createNoteDto,
    );

    if (note) throw new ConflictException();
    return await this.notesRepository.createNote(user, createNoteDto);
  }

  async findAll(user: Users) {
    return await this.notesRepository.findNotesByUserId(user);
  }

  async findOne(user: Users, id: number) {
    const note = await this.notesRepository.findNoteById(id);
    if (!note)
      throw new NotFoundException(
        "We've not found a note with this specific id!",
      );
    if (note.usersId !== user.id)
      throw new ForbiddenException('Not allowed to access others users notes!');
    return note;
  }

  async remove(user: Users, id: number) {
    await this.findOne(user, id);
    return await this.notesRepository.deletNoteById(id);
  }

  async deleteAll(usersId: number) {
    return await this.notesRepository.deleteAll(usersId);
  }
}
