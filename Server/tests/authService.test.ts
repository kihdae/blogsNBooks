import authService from '../services/authService';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        user: {
            create: jest.fn(),
            findUnique: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('AuthService', () => {
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

    describe('register', () => {
        it('should register a user successfully', async () => {
            const userData = { username: 'testuser', password: 'password123', isAdmin: false };
            const hashedPassword = 'hashedPassword';
            const createdUser = { id: 1, ...userData, password: hashedPassword };

            mockBcrypt.hash.mockResolvedValue(hashedPassword);
            mockUser.create.mockResolvedValue(createdUser);

            const result = await authService.register(userData.username, userData.password, userData.isAdmin);

            expect(result).toEqual(createdUser);
            expect(mockBcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
            expect(mockUser.create).toHaveBeenCalledWith({
                data: {
                    username: userData.username,
                    password: hashedPassword,
                    isAdmin: userData.isAdmin,
                },
            });
        });
    });

    describe('login', () => {
        it('should return a token for valid credentials', async () => {
            const userData = { username: 'testuser', password: 'password123', isAdmin: false, id: 1 };
            const hashedPassword = 'hashedPassword';
            const user = { ...userData, password: hashedPassword };
            const token = 'testToken';

            mockUser.findUnique.mockResolvedValue(user);
            mockBcrypt.compare.mockResolvedValue(true);
            mockJwt.sign.mockReturnValue(token);

            const result = await authService.login(userData.username, userData.password);

            expect(result).toEqual({ token });
            expect(mockUser.findUnique).toHaveBeenCalledWith({ where: { username: userData.username } });
            expect(mockBcrypt.compare).toHaveBeenCalledWith(userData.password, hashedPassword);
            expect(mockJwt.sign).toHaveBeenCalled();
        });

        it('should return null for invalid username', async () => {
            mockUser.findUnique.mockResolvedValue(null);

            const result = await authService.login('nonexistentuser', 'password123');

            expect(result).toBeNull();
            expect(mockUser.findUnique).toHaveBeenCalledWith({ where: { username: 'nonexistentuser' } });
        });

        it('should return null for invalid password', async () => {
            const userData = { username: 'testuser', password: 'wrongpassword', isAdmin: false, id: 1 };
            const hashedPassword = 'hashedPassword';
            const user = { ...userData, password: hashedPassword };

            mockUser.findUnique.mockResolvedValue(user);
            mockBcrypt.compare.mockResolvedValue(false);

            const result = await authService.login(userData.username, userData.password);

            expect(result).toBeNull();
            expect(mockBcrypt.compare).toHaveBeenCalledWith(userData.password, hashedPassword);
        });
    });

    describe('verifyToken', () => {
        it('should return decoded token for valid token', () => {
            const token = 'validToken';
            const decoded = { userId: 1, isAdmin: false };

            mockJwt.verify.mockReturnValue(decoded);

            const result = authService.verifyToken(token);

            expect(result).toEqual(decoded);
            expect(mockJwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET || 'your-secret-key');
        });

        it('should return null for invalid token', () => {
            mockJwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            const result = authService.verifyToken('invalidToken');

            expect(result).toBeNull();
        });
    });
});