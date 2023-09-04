import { UsersService } from '../../src/users/users.service';
import { UsersRepository } from '../../src/users/users.repository';
import { UserFactory } from '../factories/user.factory';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AuthService } from '../../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CredentialFactory } from '../factories/credentials.factory';
import { NotesFactory } from '../factories/notes.factory';
import { CardFactory } from '../factories/card.factory';

const prisma: PrismaService = new PrismaService();

export async function cleanDB() {
  await prisma.notes.deleteMany();
  await prisma.cards.deleteMany();
  await prisma.credentials.deleteMany();
  await prisma.users.deleteMany();
}

export async function createUser() {
  const usersRepository = new UsersRepository(prisma);
  const userService = new UsersService(usersRepository);
  const user = new UserFactory();
  const createdUser = await userService.create(user.Infos);

  return { ...createdUser, password: user.Infos.password };
}

export async function signIn(user) {
  const usersRepository = new UsersRepository(prisma);
  const userService = new UsersService(usersRepository);
  const jwtService = new JwtService({ secret: process.env.JWT_SECRET });

  const authService = new AuthService(userService, jwtService);

  return await authService.signIn(user);
}

export async function createCredential(user) {
  /* const credentialsRepository = new CredentialsRepository(prisma);
  const credentialService = new CredentialsService(credentialsRepository); */
  const credential = new CredentialFactory();

  return await prisma.credentials.create({
    data: {
      ...credential.infos,
      usersId: user.id,
    },
  });
}

export async function createNote(user) {
  const note = new NotesFactory();

  return await prisma.notes.create({
    data: {
      ...note.infos,
      usersId: user.id,
    },
  });
}

export async function createCard(user) {
  const card = new CardFactory();

  return await prisma.cards.create({
    data: {
      ...card.infos,
      usersId: user.id,
    },
  });
}
