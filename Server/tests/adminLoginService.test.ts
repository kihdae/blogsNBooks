import { adminLogin, hashPassword } from '../services/adminLoginService';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { z } from 'zod';

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        user: {
            findUnique: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('adminLoginService', () => {
    let prisma: any;
    let mockUser: any;
    let mockJwt: any;
    let mockBcrypt: any;

    beforeEach(() => {
        prisma = new PrismaClient();
        mockUser = prisma.user;
        mockJwt = jwt;
        mockBcrypt = bcrypt;
        jest.clearAllMocks();
    });

    describe('adminLogin', () => {
        it('should return a token for valid credentials', async () => {
            const credentials = { username: 'testuser', password: 'password123' };
            const user = { id: 1, username: 'testuser', password: 'hashedPassword' };
            const token = 'testToken';

            mockUser.findUnique.mockResolvedValue(user);
            mockBcrypt.compare.mockResolvedValue(true);
            mockJwt.sign.mockReturnValue(token);

            const result = await adminLogin(credentials);

            expect(result).toEqual({ token });
            expect(mockUser.findUnique).toHaveBeenCalledWith({ where: { username: credentials.username } });
            expect(mockBcrypt.compare).toHaveBeenCalledWith(credentials.password, user.password);
            expect(mockJwt.sign).toHaveBeenCalled();
        });

        it('should throw an error for invalid username', async () => {
            const credentials = { username: 'nonexistentuser', password: 'password123' };

            mockUser.findUnique.mockResolvedValue(null);

            await expect(adminLogin(credentials)).rejects.toThrow('invalid creds');
            expect(mockUser.findUnique).toHaveBeenCalledWith({ where: { username: credentials.username } });
        });

        it('should throw an error for invalid password', async () => {
            const credentials = { username: 'testuser', password: 'wrongpassword' };
            const user = { id: 1, username: 'testuser', password: 'hashedPassword' };

            mockUser.findUnique.mockResolvedValue(user);
            mockBcrypt.compare.mockResolvedValue(false);

            await expect(adminLogin(credentials)).rejects.toThrow('invalid creds');
            expect(mockBcrypt.compare).toHaveBeenCalledWith(credentials.password, user.password);
        });

        it('should throw an error for invalid login data', async () => {
            const credentials = { username: 123, password: null };
            await expect(adminLogin(credentials as any)).rejects.toThrow(z.ZodError);
        });
    });

    describe('hashPassword', () => {
        it('should hash a password successfully', async () => {
            const password = 'testpassword';
            const hashedPassword = 'hashedPassword';

            mockBcrypt.hash.mockResolvedValue(hashedPassword);

            const result = await hashPassword(password);

            expect(result).toEqual(hashedPassword);
            expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
        });
    });
});