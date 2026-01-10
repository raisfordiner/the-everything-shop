import supertest from 'supertest';
// Mock util/db before importing App
jest.mock('../util/db', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
        },
    },
}));

import App from '../app';
import { prisma } from '../util/db';

const appInstance = new App();
const app = appInstance.app;

describe('Auth API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('POST /api/auth/login should fail with invalid credentials', async () => {
        // Mock user not found
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        const response = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'wrongpassword',
            });

        expect([400, 401, 404]).toContain(response.status);
    });
});
