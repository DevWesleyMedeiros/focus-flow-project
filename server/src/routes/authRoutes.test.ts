import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../app';

describe('auth routes', () => {
  it('rejects an invalid Firebase ID token on the official session exchange route', async () => {
    const response = await request(app)
      .post('/api/auth/session')
      .send({ idToken: 'abc' });

    expect(response.status).toBe(401);
  });
});
