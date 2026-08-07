import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../app';

describe('auth routes', () => {
  it('exposes the firebase session route under /api/auth/firebase_session', async () => {
    const response = await request(app)
      .post('/api/auth/firebase_session')
      .send({ idToken: 'abc', csrfToken: 'missing' });

    expect(response.status).toBe(401);
  });
});
