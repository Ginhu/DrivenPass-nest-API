import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { Users } from '@prisma/client';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findNoteByTituloAndUseId(user: Users, createNoteDto: CreateNoteDto) {
    return this.prisma.notes.findFirst({
      where: {
        usersId: user.id,
        titulo: createNoteDto.titulo,
      },
    });
  }

  createNote(user: Users, createNoteDto: CreateNoteDto) {
    return this.prisma.notes.create({
      data: {
        ...createNoteDto,
        user: {
          connect: user,
        },
      },
    });
  }

  findNotesByUserId(user: Users) {
    return this.prisma.notes.findMany({
      where: {
        usersId: user.id,
      },
    });
  }

  findNoteById(id: number) {
    return this.prisma.notes.findFirst({
      where: {
        id,
      },
    });
  }

  deletNoteById(id: number) {
    return this.prisma.notes.delete({
      where: {
        id,
      },
    });
  }

  deleteAll(userId: number) {
    return this.prisma.notes.deleteMany({
      where: { usersId: userId },
    });
  }
}
