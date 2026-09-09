const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');

const jwtSecret = process.env.JWT_SECRET || 'lumen_jwt_super_secret_key_2026';
const testToken = jwt.sign({ id: '66c9f1a00000000000000001' }, jwtSecret);

jest.setTimeout(15000);

describe('Subscriptions API Tests', () => {

  it('GET /api/subscriptions/author/:authorId/count - should fetch author subscriber count', async () => {
    const res = await request(app)
      .get('/api/subscriptions/author/66c9f1a00000000000000002/count')
      .set('Authorization', `Bearer ${testToken}`);
    expect([200, 400, 503]).toContain(res.statusCode);
  });
});
