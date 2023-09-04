import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import {
  cleanDB,
  createCredential,
  createUser,
  signIn,
} from './utils/e2e.utils';

describe('Credentials (e2e)', () => {
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

  describe('Credentials creation (e2e)', () => {
    it('/credentials (POST) => Should return statusCode 403 when wrong token is sent', async () => {
      await request(app.getHttpServer())
        .post('/credentials')
        .set('Authorization', `Bearer `)
        .send({
          url: 'gin.com.br',
          login: 'gin123',
          password: 'gin123',
          rotulo: 'ginrotulo',
        })
        .expect(403);
    });

    it('/credentials (POST) => Should return statusCode 400 when url is not sent', async () => {
      const user = await createUser();
      const token = await signIn(user);
      await request(app.getHttpServer())
        .post('/credentials')
        .set('Authorization', `Bearer ${token}`)
        .send({
          login: 'gin123',
          password: 'gin123',
          rotulo: 'ginrotulo',
        })
        .expect(400);
    });

    it('/credentials (POST) => Should return statusCode 400 when login is not sent', async () => {
      const user = await createUser();
      const token = await signIn(user);
      await request(app.getHttpServer())
        .post('/credentials')
        .set('Authorization', `Bearer ${token}`)
        .send({
          url: 'gin.com.br',
          password: 'gin123',
          rotulo: 'ginrotulo',
        })
        .expect(400);
    });
    it('/credentials (POST) => Should return statusCode 400 when password is not sent', async () => {
      const user = await createUser();
      const token = await signIn(user);
      await request(app.getHttpServer())
        .post('/credentials')
        .set('Authorization', `Bearer ${token}`)
        .send({
          url: 'gin.com.br',
          login: 'gin123',
          rotulo: 'ginrotulo',
        })
        .expect(400);
    });
    it('/credentials (POST) => Should return statusCode 400 when rotulo is not sent', async () => {
      const user = await createUser();
      const token = await signIn(user);
      await request(app.getHttpServer())
        .post('/credentials')
        .set('Authorization', `Bearer ${token}`)
        .send({
          url: 'gin.com.br',
          login: 'gin123',
          password: 'gin123',
        })
        .expect(400);
    });

    it('/credentials (POST) => Should return 409 when there is already a rotulo registered for this user', async () => {
      const user = await createUser();
      const token = await signIn(user);
      await request(app.getHttpServer())
        .post('/credentials')
        .set('Authorization', `Bearer ${token}`)
        .send({
          url: 'gin.com.br',
          login: 'gin123',
          password: 'gin123',
          rotulo: 'ginrotulo',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/credentials')
        .set('Authorization', `Bearer ${token}`)
        .send({
          url: 'gin.com.br',
          login: 'gin123',
          password: 'gin123',
          rotulo: 'ginrotulo',
        })
        .expect(409);
    });

    it('/credentials (POST) => Should return statusCode 201 when created', async () => {
      const user = await createUser();
      const token = await signIn(user);
      await request(app.getHttpServer())
        .post('/credentials')
        .set('Authorization', `Bearer ${token}`)
        .send({
          url: 'gin.com.br',
          login: 'gin123',
          password: 'gin123',
          rotulo: 'ginrotulo',
        })
        .expect(201);
    });
  });

  describe('Credentials Find (e2e)', () => {
    it('/credentials (GET) => Should return statusCode 403 if token provided is incorrect', async () => {
      await request(app.getHttpServer())
        .get('/credentials')
        .set('Authorization', `Bearer `)
        .expect(403);
    });

    it('/credentials (GET) => Should return statusCode 200 and an array with all users credentials', async () => {
      const user = await createUser();
      const token = await signIn(user);
      await request(app.getHttpServer())
        .get('/credentials')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('/credentials/id (GET) => Should return statusCode 403 if token provided is incorrect', async () => {
      await request(app.getHttpServer())
        .get('/credentials/1')
        .set('Authorization', `Bearer `)
        .expect(403);
    });

    it('/credentials/id (GET) => Should return statusCode 404 if there is no credentials with the provided id', async () => {
      const user = await createUser();
      const token = await signIn(user);
      // const credential = await createCredential(user);
      await request(app.getHttpServer())
        .get('/credentials/-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('/credentials/id (GET) => Should return statusCode 403 if provided id does not belong to user', async () => {
      const user1 = await createUser();
      const credential1 = await createCredential(user1);

      const user = await createUser();
      const token = await signIn(user);

      await request(app.getHttpServer())
        .get(`/credentials/${credential1.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
    it('/credentials/id (GET) => Should return statusCode 200 and an array with all users credentials', async () => {
      const user = await createUser();
      const token = await signIn(user);
      const credential = await createCredential(user);
      await request(app.getHttpServer())
        .get(`/credentials/${credential.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('Credentials Delete (e2e)', () => {
    it('/credentials/id (DELETE) => Should return statusCode 404 if there is no credentials with the provided id', async () => {
      const user = await createUser();
      const token = await signIn(user);
      // const credential = await createCredential(user);
      await request(app.getHttpServer())
        .delete('/credentials/-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
    it('/credentials/id (DELETE) => Should return statusCode 403 if provided id does not belong to user', async () => {
      const user1 = await createUser();
      const credential1 = await createCredential(user1);

      const user = await createUser();
      const token = await signIn(user);

      await request(app.getHttpServer())
        .delete(`/credentials/${credential1.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
    it('/credentials/id (DELETE) => Should return statusCode 200 if credential is deleted', async () => {
      const user = await createUser();
      const token = await signIn(user);
      const credential = await createCredential(user);
      await request(app.getHttpServer())
        .delete(`/credentials/${credential.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
});
