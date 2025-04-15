import request from 'supertest';
import { app } from '../server';
import mongoose from 'mongoose';

describe('API Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/messaging-tracker-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Authentication', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@example.com', password: 'password' });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });
  });

  describe('Conversations', () => {
    let token: string;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@example.com', password: 'password' });
      token = res.body.token;
    });

    it('should get conversations with valid token', async () => {
      const res = await request(app)
        .get('/api/conversations')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });

    it('should sync conversations', async () => {
      const res = await request(app)
        .post('/api/conversations/sync')
        .set('Authorization', `Bearer ${token}`)
        .send({ platform: 'whatsapp', identifier: '1234567890' });
      expect(res.status).toBe(200);
    });
  });
});
