import supertest from 'supertest';
import App from '../app';

const appInstance = new App();
const app = appInstance.app;

describe('Auth API', () => {
    it('POST /api/auth/login should fail with invalid credentials', async () => {
        const response = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'wrongpassword',
            });

        expect([400, 401, 404]).toContain(response.status);
    });
});
