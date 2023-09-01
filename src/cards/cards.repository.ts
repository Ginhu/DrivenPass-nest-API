import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { Users } from '@prisma/client';

@Injectable()
export class CardsRepository {
  private secret = process.env.CRYPTR_SECRET;
  private Cryptr = require('cryptr');
  private cryptr = new this.Cryptr(this.secret);

  constructor(private readonly prisma: PrismaService) {}

  findCardByUserIdAndRotulo(userId: number, rotulo: string) {
    return this.prisma.cards.findFirst({
      where: {
        usersId: userId,
        rotulo: rotulo,
      },
    });
  }

  findCardByNumber(number: number) {
    return this.prisma.cards.findFirst({
      where: {
        number: number,
      },
    });
  }

  createCard(user: Users, createCardDto: CreateCardDto) {
    return this.prisma.cards.create({
      data: {
        number: createCardDto.number,
        name: createCardDto.name,
        cvc: createCardDto.cvc,
        expirationDate: new Date(createCardDto.expirationDate),
        password: this.cryptr.encrypt(createCardDto.password),
        vitual: createCardDto.virtual,
        type: createCardDto.type,
        rotulo: createCardDto.rotulo,
        user: {
          connect: user,
        },
      },
    });
  }

  findAllUserCards(user: Users) {
    return this.prisma.cards.findMany({
      where: {
        usersId: user.id,
      },
    });
  }

  findCardById(id: number) {
    return this.prisma.cards.findFirst({
      where: {
        id,
      },
    });
  }

  deletCardById(id: number) {
    return this.prisma.cards.delete({
      where: {
        id,
      },
    });
  }

  deleteAll(userId: number) {
    return this.prisma.cards.deleteMany({
      where: {
        usersId: userId,
      },
    });
  }
}
