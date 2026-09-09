const request = require('supertest');
const app = require('../server');

describe('Reports API Tests', () => {
  it('POST /api/reports - should allow submitting a content report', async () => {
    const res = await request(app)
      .post('/api/reports')
      .send({
        type: 'Article',
        item: 'Test Reported Article',
        reason: 'Inaccurate facts',
        description: 'Detailing inaccurate claims in test article',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
