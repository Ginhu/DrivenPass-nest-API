import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import {
  cleanDB,
  createCard,
  createNote,
  createUser,
  signIn,
} from './utils/e2e.utils';
import { CardFactory } from './factories/card.factory';

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
    it('/cards (POST) => Should return statusCode 403 when wrong token is sent', async () => {
      await request(app.getHttpServer())
        .post('/cards')
        .set('Authorization', `Bearer `)
        .expect(403);
    });

    it('/cards (POST) => Should return statusCode 400 when number is not sent', async () => {
      const user = await createUser();
      const token = await signIn(user);
      const card = new CardFactory();
      const { number, ...cardData } = card.infos;
      await request(app.getHttpServer())
        .post('/cards')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...cardData,
        })
        .expect(400);
    });

    it('/cards (POST) => Should return statusCode 400 when name is not sent', async () => {
      const user = await createUser();
      const token = await signIn(user);
      const card = new CardFactory();
      const { name, ...cardData } = card.infos;
      await request(app.getHttpServer())
        .post('/cards')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...cardData,
        })
        .expect(400);
    });

    it('/cards (POST) => Should return statusCode 400 when cvc is not sent', async () => {
      const user = await createUser();
      const token = await signIn(user);
      const card = new CardFactory();
      const { cvc, ...cardData } = card.infos;
      await request(app.getHttpServer())
        .post('/cards')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...cardData,
        })
        .expect(400);
    });

    it('/cards (POST) => Should return statusCode 400 when expirationDate is not sent', async () => {
      const user = await createUser();
      const token = await signIn(user);
      const card = new CardFactory();
      const { expirationDate, ...cardData } = card.infos;
      await request(app.getHttpServer())
        .post('/cards')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...cardData,
        })
        .expect(400);
    });

    it('/cards (POST) => Should return statusCode 400 when password is not sent', async () => {
      const user = await createUser();
      const token = await signIn(user);
      const card = new CardFactory();
      const { password, ...cardData } = card.infos;
      await request(app.getHttpServer())
        .post('/cards')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...cardData,
        })
        .expect(400);
    });

    it('/cards (POST) => Should return statusCode 400 when virtual is not sent', async () => {
      const user = await createUser();
      const token = await signIn(user);
      const card = new CardFactory();
      const { virtual, ...cardData } = card.infos;
      await request(app.getHttpServer())
        .post('/cards')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...cardData,
        })
        .expect(400);
    });

    it('/cards (POST) => Should return statusCode 400 when type is not sent', async () => {
      const user = await createUser();
      const token = await signIn(user);
      const card = new CardFactory();
      const { type, ...cardData } = card.infos;
      await request(app.getHttpServer())
        .post('/cards')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...cardData,
        })
        .expect(400);
    });

    it('/cards (POST) => Should return statusCode 400 when rotulo is not sent', async () => {
      const user = await createUser();
      const token = await signIn(user);
      const card = new CardFactory();
      const { rotulo, ...cardData } = card.infos;
      await request(app.getHttpServer())
        .post('/cards')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...cardData,
        })
        .expect(400);
    });

    it('/cards (POST) => Should return 409 when there is already a rotulo registered for this user', async () => {
      const user = await createUser();
      const token = await signIn(user);
      const card = await createCard(user);
      const { id, usersId, ...seccondInfo } = card;
      console.log(seccondInfo);
      await request(app.getHttpServer())
        .post('/cards')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...seccondInfo,
        })
        .expect(409);
    });

    it('/cards (POST) => Should return statusCode 201 when created', async () => {
      const user = await createUser();
      const token = await signIn(user);
      const card = new CardFactory();
      await request(app.getHttpServer())
        .post('/cards')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...card.infos,
        })
        .expect(201);
    });
  });

  describe('Cards Find (e2e)', () => {
    it('/cards (GET) => Should return statusCode 403 if token provided is incorrect', async () => {
      await request(app.getHttpServer())
        .get('/cards')
        .set('Authorization', `Bearer `)
        .expect(403);
    });

    it('/cards (GET) => Should return statusCode 200 and an array with all users credentials', async () => {
      const user = await createUser();
      const token = await signIn(user);
      await request(app.getHttpServer())
        .get('/cards')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('/cards/id (GET) => Should return statusCode 403 if token provided is incorrect', async () => {
      await request(app.getHttpServer())
        .get('/cards/1')
        .set('Authorization', `Bearer `)
        .expect(403);
    });

    it('/cards/id (GET) => Should return statusCode 404 if there is no credentials with the provided id', async () => {
      const user = await createUser();
      const token = await signIn(user);
      await request(app.getHttpServer())
        .get('/cards/-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('/cards/id (GET) => Should return statusCode 403 if provided id does not belong to user', async () => {
      const user1 = await createUser();
      const card = await createCard(user1);

      const user = await createUser();
      const token = await signIn(user);

      await request(app.getHttpServer())
        .get(`/cards/${card.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
    it('/cards/id (GET) => Should return statusCode 200 and an array with all users credentials', async () => {
      const user = await createUser();
      const token = await signIn(user);
      const card = await createCard(user);
      await request(app.getHttpServer())
        .get(`/cards/${card.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('Cards Delete (e2e)', () => {
    it('/cards/id (DELETE) => Should return statusCode 404 if there is no credentials with the provided id', async () => {
      const user = await createUser();
      const token = await signIn(user);
      // const credential = await createCredential(user);
      await request(app.getHttpServer())
        .delete('/cards/-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
    it('/cards/id (DELETE) => Should return statusCode 403 if provided id does not belong to user', async () => {
      const user1 = await createUser();
      const card = await createCard(user1);

      const user = await createUser();
      const token = await signIn(user);

      await request(app.getHttpServer())
        .delete(`/cards/${card.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
    it('/cards/id (DELETE) => Should return statusCode 200 if credential is deleted', async () => {
      const user = await createUser();
      const token = await signIn(user);
      const card = await createCard(user);
      await request(app.getHttpServer())
        .delete(`/cards/${card.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
});
