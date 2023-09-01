import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  private SALT = 10;
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.users.create({
      data: {
        ...createUserDto,
        password: bcrypt.hashSync(createUserDto.password, this.SALT),
      },
    });
    return { id: user.id, email: user.email, password: 'PROTECTED' };
  }

  findByEmail(email: string) {
    return this.prisma.users.findFirst({
      where: { email },
    });
  }

  findById(id: number) {
    return this.prisma.users.findFirst({
      where: { id },
    });
  }

  deleteAll(id: number) {
    return this.prisma.users.delete({
      where: {
        id,
      },
    });
  }
}
