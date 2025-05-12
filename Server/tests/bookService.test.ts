import bookService from '../services/bookService';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        book: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('BookService', () => {
    let prisma: any;
    let mockBook: any;

    beforeEach(() => {
        prisma = new PrismaClient();
        mockBook = prisma.book;
        jest.clearAllMocks();
    });

    describe('createBook', () => {
        it('should create a book successfully', async () => {
            const bookData = { title: 'Test Book', authorId: 1 };
            const createdBook = { id: 1, ...bookData, createdAt: new Date(), updatedAt: new Date() };
            (prisma.book.create as jest.Mock).mockResolvedValue(createdBook);

            const result = await bookService.createBook(bookData);

            expect(result).toEqual(createdBook);
            expect(prisma.book.create).toHaveBeenCalledWith({ data: bookData });
        });

        it('should throw a ZodError for invalid book data', async () => {
            const bookData = { title: 123, authorId: 'invalid' };
            await expect(bookService.createBook(bookData as any)).rejects.toThrow(z.ZodError);
            expect(prisma.book.create).not.toHaveBeenCalled();
        });
    });

    describe('getBookById', () => {
        it('should return a book when it exists', async () => {
            const book = { id: 1, title: 'Test Book', authorId: 1, createdAt: new Date(), updatedAt: new Date(), author: { id: 1, name: 'testAuthor' }, reviews: [], blogposts: [], bookThoughtBubbles: [] };
            (prisma.book.findUnique as jest.Mock).mockResolvedValue(book);

            const result = await bookService.getBookById(1);

            expect(result).toEqual(book);
            expect(prisma.book.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, include: { author: true, reviews: true, blogposts: true, bookThoughtBubbles: true } });
        });

        it('should return null when the book does not exist', async () => {
            (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await bookService.getBookById(2);

            expect(result).toBeNull();
            expect(prisma.book.findUnique).toHaveBeenCalledWith({ where: { id: 2 }, include: { author: true, reviews: true, blogposts: true, bookThoughtBubbles: true } });
        });

        it('should throw a ZodError for invalid book ID', async () => {
            await expect(bookService.getBookById('invalid' as any)).rejects.toThrow(z.ZodError);
            expect(prisma.book.findUnique).not.toHaveBeenCalled();
        });
    });

    describe('getAllBooks', () => {
        it('should return all books', async () => {
            const books = [{ id: 1, title: 'Book 1', authorId: 1, createdAt: new Date(), updatedAt: new Date(), author: { id: 1, name: 'testAuthor' }, bookThoughtBubbles: [] }, { id: 2, title: 'Book 2', authorId: 2, createdAt: new Date(), updatedAt: new Date(), author: { id: 2, name: 'testAuthor2' }, bookThoughtBubbles: [] }];
            (prisma.book.findMany as jest.Mock).mockResolvedValue(books);

            const result = await bookService.getAllBooks();

            expect(result).toEqual(books);
            expect(prisma.book.findMany).toHaveBeenCalledWith({ include: { author: true, bookThoughtBubbles: true } });
        });
    });

    describe('updateBook', () => {
        it('should update a book successfully', async () => {
            const updatedBookData = { title: 'Updated Book' };
            const updatedBook = { id: 1, title: 'Updated Book', authorId: 1, createdAt: new Date(), updatedAt: new Date(), author: { id: 1, name: 'testAuthor' } };
            (prisma.book.update as jest.Mock).mockResolvedValue(updatedBook);

            const result = await bookService.updateBook(1, updatedBookData);

            expect(result).toEqual(updatedBook);
            expect(prisma.book.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updatedBookData, include: { author: true } });
        });

        it('should throw a ZodError for invalid update data', async () => {
            const invalidData = { authorId: 'invalid' };
            await expect(bookService.updateBook(1, invalidData as any)).rejects.toThrow(z.ZodError);
            expect(prisma.book.update).not.toHaveBeenCalled();
        });
    });

    describe('deleteBook', () => {
        it('should delete a book successfully', async () => {
            const deletedBook = { id: 1, title: 'Test Book', authorId: 1, createdAt: new Date(), updatedAt: new Date() };
            (prisma.book.delete as jest.Mock).mockResolvedValue(deletedBook);

            const result = await bookService.deleteBook(1);

            expect(result).toEqual(deletedBook);
            expect(prisma.book.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw a ZodError for invalid book ID', async () => {
            await expect(bookService.deleteBook('invalid' as any)).rejects.toThrow(z.ZodError);
            expect(prisma.book.delete).not.toHaveBeenCalled();
        });
    });
});