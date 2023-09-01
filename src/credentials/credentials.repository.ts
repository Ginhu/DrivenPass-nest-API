import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Users } from '@prisma/client';
import { CreateCredentialDto } from './dto/create-credential.dto';

@Injectable()
export class CredentialsRepository {
  private secret = process.env.CRYPTR_SECRET;
  private Cryptr = require('cryptr');
  private cryptr = new this.Cryptr(this.secret);

  constructor(private readonly prisma: PrismaService) {}

  createCredentials(user: Users, createCredentialDto: CreateCredentialDto) {
    return this.prisma.credentials.create({
      data: {
        ...createCredentialDto,
        user: {
          connect: user,
        },
        password: this.cryptr.encrypt(createCredentialDto.password),
      },
    });
  }

  findCredentialByUserIdAndRotulo(id: number, rotulo: string) {
    return this.prisma.credentials.findFirst({
      where: {
        usersId: id,
        rotulo,
      },
    });
  }

  findCredentialsByUserId(id: number) {
    return this.prisma.credentials.findMany({
      where: {
        usersId: id,
      },
    });
  }

  findByIdAndUserId(id: number) {
    return this.prisma.credentials.findFirst({
      where: {
        id,
      },
    });
  }

  deleteCredentialById(id: number) {
    return this.prisma.credentials.delete({
      where: {
        id,
      },
    });
  }

  deleteAll(userId: number) {
    return this.prisma.credentials.deleteMany({
      where: {
        usersId: userId,
      },
    });
  }
}
