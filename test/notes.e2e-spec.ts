import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { cleanDB, createNote, createUser, signIn } from './utils/e2e.utils';

describe('Notes (e2e)', () => {
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

  describe('Notes creation (e2e)', () => {
    it('/notes (POST) => Should return statusCode 403 when wrong token is sent', async () => {
      await request(app.getHttpServer())
        .post('/notes')
        .set('Authorization', `Bearer `)
        .expect(403);
    });

    it('/notes (POST) => Should return statusCode 400 when titulo is not sent', async () => {
      const user = await createUser();
      const token = await signIn(user);
      await request(app.getHttpServer())
        .post('/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          note: 'note',
        })
        .expect(400);
    });

    it('/notes (POST) => Should return statusCode 400 when note is not sent', async () => {
      const user = await createUser();
      const token = await signIn(user);
      await request(app.getHttpServer())
        .post('/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: 'tituloNote',
        })
        .expect(400);
    });

    it('/notes (POST) => Should return 409 when there is already a rotulo registered for this user', async () => {
      const user = await createUser();
      const token = await signIn(user);
      await request(app.getHttpServer())
        .post('/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: 'tituloNote',
          note: 'note',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: 'tituloNote',
          note: 'note',
        })
        .expect(409);
    });

    it('/notes (POST) => Should return statusCode 201 when created', async () => {
      const user = await createUser();
      const token = await signIn(user);
      await request(app.getHttpServer())
        .post('/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: 'tituloNote',
          note: 'note',
        })
        .expect(201);
    });
  });

  describe('Notes Find (e2e)', () => {
    it('/notes (GET) => Should return statusCode 403 if token provided is incorrect', async () => {
      await request(app.getHttpServer())
        .get('/notes')
        .set('Authorization', `Bearer `)
        .expect(403);
    });

    it('/notes (GET) => Should return statusCode 200 and an array with all users credentials', async () => {
      const user = await createUser();
      const token = await signIn(user);
      await request(app.getHttpServer())
        .get('/notes')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('/notes/id (GET) => Should return statusCode 403 if token provided is incorrect', async () => {
      await request(app.getHttpServer())
        .get('/notes/1')
        .set('Authorization', `Bearer `)
        .expect(403);
    });

    it('/notes/id (GET) => Should return statusCode 404 if there is no credentials with the provided id', async () => {
      const user = await createUser();
      const token = await signIn(user);
      await request(app.getHttpServer())
        .get('/notes/-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('/notes/id (GET) => Should return statusCode 403 if provided id does not belong to user', async () => {
      const user1 = await createUser();
      const note = await createNote(user1);

      const user = await createUser();
      const token = await signIn(user);

      await request(app.getHttpServer())
        .get(`/notes/${note.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
    it('/notes/id (GET) => Should return statusCode 200 and an array with all users credentials', async () => {
      const user = await createUser();
      const token = await signIn(user);
      const note = await createNote(user);
      await request(app.getHttpServer())
        .get(`/notes/${note.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('Notes Delete (e2e)', () => {
    it('/notes/id (DELETE) => Should return statusCode 404 if there is no credentials with the provided id', async () => {
      const user = await createUser();
      const token = await signIn(user);
      // const credential = await createCredential(user);
      await request(app.getHttpServer())
        .delete('/notes/-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
    it('/notes/id (DELETE) => Should return statusCode 403 if provided id does not belong to user', async () => {
      const user1 = await createUser();
      const note = await createNote(user1);

      const user = await createUser();
      const token = await signIn(user);

      await request(app.getHttpServer())
        .delete(`/notes/${note.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
    it('/notes/id (DELETE) => Should return statusCode 200 if credential is deleted', async () => {
      const user = await createUser();
      const token = await signIn(user);
      const note = await createNote(user);
      await request(app.getHttpServer())
        .delete(`/notes/${note.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
});
