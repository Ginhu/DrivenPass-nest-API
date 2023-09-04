import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { cleanDB } from './utils/e2e.utils';
import { UserFactory } from './factories/user.factory';

describe('Cards (e2e)', () => {
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

  describe('Cards creation (e2e)', () => {
    it('/users/sign-up (POST)', async () => {
      const user = new UserFactory();
      await request(app.getHttpServer())
        .post('/users/sign-up')
        .send({ ...user.Infos })
        .expect(201);
    });
  });
});
