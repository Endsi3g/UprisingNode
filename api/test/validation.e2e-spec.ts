import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Validation (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Enable global validation pipe for this test to simulate the fix
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));
    await app.init();
  });

  afterEach(async () => {
      await app.close();
  });

  it('/auth/register (POST) should fail with invalid email', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      })
      .expect(400)
      .expect((res) => {
        // Expect validation error message
        expect(res.body.message).toEqual(expect.arrayContaining(['email must be an email']));
        expect(res.body.error).toEqual('Bad Request');
      });
  });

  it('/auth/register (POST) should fail with short password', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'valid@example.com',
        password: '123', // Too short (min 6)
        name: 'Test User',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual(expect.arrayContaining(['password must be longer than or equal to 6 characters']));
      });
  });
});
