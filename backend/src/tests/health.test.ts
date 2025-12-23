import supertest from 'supertest';
import App from '../app';

const appInstance = new App();
const app = appInstance.app;

describe('Health Check API', () => {
    it('GET /api/health should return 200', async () => {
        const response = await supertest(app).get('/api/health');
        expect(response.status).toBe(200);
    });
});
