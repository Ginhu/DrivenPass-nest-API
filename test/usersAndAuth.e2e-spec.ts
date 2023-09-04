import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { cleanDB, createUser } from './utils/e2e.utils';
import { UserFactory } from './factories/user.factory';

describe('Users and Auth (e2e)', () => {
  let app: INestApplication;
  const prisma: PrismaService = new PrismaService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    await cleanDB();
  });

  describe('Users (e2e)', () => {
    it('/users/sign-up (POST)', async () => {
      const user = new UserFactory();
      await request(app.getHttpServer())
        .post('/users/sign-up')
        .send({ ...user.Infos })
        .expect(201);
    });

    it('/users/sign-up (POST) => Should return statusCode 409 if attempt to post a sign-up with an existing email', async () => {
      await prisma.users.create({
        data: {
          email: 'teste@teste.com',
          password: 'teste1234A*',
        },
      });

      await request(app.getHttpServer())
        .post('/users/sign-up')
        .send({ email: 'teste@teste.com', password: 'teste1234A*' })
        .expect(409);
    });

    it('/users/sign-up (POST) => Should return statusCode 400 if attempt to post a sign-up with a missing email', async () => {
      await request(app.getHttpServer())
        .post('/users/sign-up')
        .send({ password: 'teste1234A*' })
        .expect(400);
    });

    it('/users/sign-up (POST) => Should return statusCode 400 if attempt to post a sign-up with a missing password', async () => {
      await request(app.getHttpServer())
        .post('/users/sign-up')
        .send({ email: 'teste@teste.com' })
        .expect(400);
    });

    it('/users/sign-up (POST) => Should return statusCode 400 if attempt to post a sign-up with a weak password', async () => {
      await request(app.getHttpServer())
        .post('/users/sign-up')
        .send({ email: 'teste@teste.com', password: 'ab123456789' })
        .expect(400);
    });
  });

  describe('Auth (e2e)', () => {
    it('/auth/sign-in (POST) => Should return statusCode 200 when login successfully', async () => {
      const user = await createUser();

      await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ email: user.email, password: user.password })
        .expect(200);
    });

    it('/auth/sign-in (POST) => Should return statusCode 401 when wrong email is provided', async () => {
      const user = await createUser();

      await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ email: 'WrongEmail@mail.com', password: user.password })
        .expect(401);
    });

    it('/auth/sign-in (POST) => Should return statusCode 401 when wrong password is provided', async () => {
      const user = await createUser();

      await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ email: user.email, password: 'WrongPassword123*' })
        .expect(401);
    });
  });
});
