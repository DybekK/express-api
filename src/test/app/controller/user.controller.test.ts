import request from 'supertest';
import { app } from '../../../app';
import {delay} from "../../../app/common/delay";

describe('UserController', () => {
    describe('POST /api/sign-in', () => {
        it('should return token after successful login', async () => {
            // given
            const credentials = {
                email: 'example@gmail.com',
                password: '123'
            }
            // when
            const result = await request(app).post('/api/sign-in').send(credentials)
            // then
            expect(result.status).toBe(200);
            expect(result.body.authToken).toBeDefined();
        });

        it('should return 400 code when email is missing', async () => {
            // given
            const credentials = {
                password: '123'
            }
            // when
            const result = await request(app).post('/api/sign-in').send(credentials)
            // then
            expect(result.status).toBe(400);
            expect(result.body.error).toBe('missing required fields email and password');
        });

        it('should return 400 code when password is missing', async () => {
            // given
            const credentials = {
                email: 'example@gmail.com',
            }
            // when
            const result = await request(app).post('/api/sign-in').send(credentials)
            // then
            expect(result.status).toBe(400);
            expect(result.body.error).toBe('missing required fields email and password');
        });

        it('should return 401 code when email is wrong', async () => {
            // given
            const credentials = {
                email: 'wrong',
                password: '123'
            }
            // when
            const result = await request(app).post('/api/sign-in').send(credentials)
            // then
            expect(result.status).toBe(401);
            expect(result.body.error).toBe('invalid email or password')
        });

        it('should return 401 code when password is wrong', async () => {
            // given
            const credentials = {
                email: 'example@gmail.com',
                password: 'wrong'
            }
            // when
            const result = await request(app).post('/api/sign-in').send(credentials)
            // then
            expect(result.status).toBe(401);
            expect(result.body.error).toBe('invalid email or password')
        });

        it('should return 401 code when password and email are wrong', async () => {
            // given
            const credentials = {
                email: 'example@gmail.com',
                password: 'wrong'
            }
            // when
            const result = await request(app).post('/api/sign-in').send(credentials)
            // then
            expect(result.status).toBe(401);
            expect(result.body.error).toBe('invalid email or password')
        });

        it('should return 401 code after token expiration', async () => {
            process.env.EXPIRATION_TOKEN_TIME = '1';
            const credentials = {
                email: 'example@gmail.com',
                password: '123'
            }

            let result = await request(app).post('/api/sign-in').send(credentials)
            let bearer = `Bearer ${result.body.authToken}`;
            await delay(1000);

            // when
            result = await request(app).post('/api/generate-key-pair')
                .send()
                .set({Authorization: bearer})
            // then
            expect(result.status).toBe(401);
            expect(result.body.error).toBe('jwt expired')
            process.env.EXPIRATION_TOKEN_TIME = '300';
        });
    });

    describe('GET /api/generate-key-pair', () => {
        let bearer: string;
        beforeEach(async () => {
            const credentials = {
                email: 'example@gmail.com',
                password: '123'
            }
            const result = await request(app).post('/api/sign-in').send(credentials)
            bearer = `Bearer ${result.body.authToken}`;
        });

        it('should return 401 code if token is missing', async () => {
            // when
            const result = await request(app).post('/api/generate-key-pair').send()
            // then
            expect(result.status).toBe(401);
        });

        it('should return key pairs code', async () => {
            // when
            const result = await request(app).post('/api/generate-key-pair')
                .set({Authorization: bearer})
                .send()
            // then
            expect(result.status).toBe(200);
            expect(result.body.privKey).toBeDefined();
            expect(result.body.pubKey).toBeDefined();
        });
    });

    describe('POST /api/encrypt', () => {
        let bearer: string;
        beforeEach(async () => {
            const credentials = {
                email: 'example@gmail.com',
                password: '123'
            }
            const result = await request(app).post('/api/sign-in').send(credentials)
            bearer = `Bearer ${result.body.authToken}`;
        });

        it('should return 401 code if token is missing', async () => {
            // when
            const result = await request(app).post('/api/encrypt').send()
            // then
            expect(result.status).toBe(401);
        });

        it('should return encrypted value', async () => {
            // when
            const result = await request(app).post('/api/encrypt')
                .set({Authorization: bearer})
                .send()
            // then
            expect(result.status).toBe(200);
            expect(result.body).toBeDefined();
        });
    });
});
