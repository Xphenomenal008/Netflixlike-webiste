import request from 'supertest';
import app from '../server.js'; // make sure to include the .js extension

describe('GET /api/health', () => {
  it('should return status 200 and message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('API is running');
  });
});
