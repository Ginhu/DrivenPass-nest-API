import { UsersService } from '../../src/users/users.service';
import { UsersRepository } from '../../src/users/users.repository';
import { UserFactory } from '../factories/user.factory';
import { PrismaService } from '../../src/prisma/prisma.service';

const prisma: PrismaService = new PrismaService();

export async function cleanDB() {
  await prisma.notes.deleteMany();
  await prisma.cards.deleteMany();
  await prisma.credentials.deleteMany();
  await prisma.users.deleteMany();
}

export async function createUser() {
  const userService = new UsersService(new UsersRepository(prisma));
  const user = new UserFactory();
  await userService.create(user.Infos);

  return user;
}
