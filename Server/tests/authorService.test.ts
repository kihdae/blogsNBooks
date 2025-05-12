import authorService from '../services/authorService';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        author: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('AuthorService', () => {
    let prisma: any;
    let mockAuthor: any;

    beforeEach(() => {
        prisma = new PrismaClient();
        mockAuthor = prisma.author;
        jest.clearAllMocks();
    });

    describe('createAuthor', () => {
        it('should create an author successfully', async () => {
            const authorData = { name: 'Test Author', imageUrl: 'http://example.com/image.jpg' };
            const createdAuthor = { id: 1, ...authorData, createdAt: new Date(), updatedAt: new Date() };
            mockAuthor.create.mockResolvedValue(createdAuthor);

            const result = await authorService.createAuthor(authorData);

            expect(result).toEqual(createdAuthor);
            expect(mockAuthor.create).toHaveBeenCalledWith({ data: authorData });
        });

        it('should throw a ZodError for invalid author data', async () => {
            const authorData = { name: 123, imageUrl: 'invalid-url' };
            await expect(authorService.createAuthor(authorData as any)).rejects.toThrow(z.ZodError);
            expect(mockAuthor.create).not.toHaveBeenCalled();
        });
    });

    describe('getAuthorById', () => {
        it('should return an author when it exists', async () => {
            const author = { id: 1, name: 'Test Author', createdAt: new Date(), updatedAt: new Date(), books: [] };
            mockAuthor.findUnique.mockResolvedValue(author);

            const result = await authorService.getAuthorById(1);

            expect(result).toEqual(author);
            expect(mockAuthor.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, include: { books: true } });
        });

        it('should return null when the author does not exist', async () => {
            mockAuthor.findUnique.mockResolvedValue(null);

            const result = await authorService.getAuthorById(2);

            expect(result).toBeNull();
            expect(mockAuthor.findUnique).toHaveBeenCalledWith({ where: { id: 2 }, include: { books: true } });
        });

        it('should throw a ZodError for invalid author ID', async () => {
            await expect(authorService.getAuthorById('invalid' as any)).rejects.toThrow(z.ZodError);
            expect(mockAuthor.findUnique).not.toHaveBeenCalled();
        });
    });

    describe('getAllAuthors', () => {
        it('should return all authors', async () => {
            const authors = [{ id: 1, name: 'Author 1', createdAt: new Date(), updatedAt: new Date(), books: [] }, { id: 2, name: 'Author 2', createdAt: new Date(), updatedAt: new Date(), books: [] }];
            mockAuthor.findMany.mockResolvedValue(authors);

            const result = await authorService.getAllAuthors();

            expect(result).toEqual(authors);
            expect(mockAuthor.findMany).toHaveBeenCalledWith({ include: { books: true } });
        });
    });

    describe('updateAuthor', () => {
        it('should update an author successfully', async () => {
            const updatedAuthorData = { name: 'Updated Author', imageUrl: 'http://updated.com/image.jpg' };
            const updatedAuthor = { id: 1, ...updatedAuthorData, createdAt: new Date(), updatedAt: new Date(), books: [] };
            mockAuthor.update.mockResolvedValue(updatedAuthor);

            const result = await authorService.updateAuthor(1, updatedAuthorData);

            expect(result).toEqual(updatedAuthor);
            expect(mockAuthor.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updatedAuthorData, include: { books: true } });
        });

        it('should throw a ZodError for invalid update data', async () => {
            const invalidData = { name: 123, imageUrl: 'invalid-url' };
            await expect(authorService.updateAuthor(1, invalidData as any)).rejects.toThrow(z.ZodError);
            expect(mockAuthor.update).not.toHaveBeenCalled();
        });
    });

    describe('deleteAuthor', () => {
        it('should delete an author successfully', async () => {
            const deletedAuthor = { id: 1, name: 'Test Author', createdAt: new Date(), updatedAt: new Date() };
            mockAuthor.delete.mockResolvedValue(deletedAuthor);

            const result = await authorService.deleteAuthor(1);

            expect(result).toEqual(deletedAuthor);
            expect(mockAuthor.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw a ZodError for invalid author ID', async () => {
            await expect(authorService.deleteAuthor('invalid' as any)).rejects.toThrow(z.ZodError);
            expect(mockAuthor.delete).not.toHaveBeenCalled();
        });
    });
});