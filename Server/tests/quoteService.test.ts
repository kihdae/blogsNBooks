import quoteService from '../services/quoteService';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        quote: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('QuoteService', () => {
    let prisma: any;
    let mockQuote: any;

    beforeEach(() => {
        prisma = new PrismaClient();
        mockQuote = prisma.quote;
        jest.clearAllMocks();
    });

    describe('createQuote', () => {
        it('should create a quote successfully', async () => {
            const quoteData = { bookId: 1, content: 'Test Quote Content' };
            const createdQuote = { id: 1, ...quoteData, createdAt: new Date(), updatedAt: new Date() };
            mockQuote.create.mockResolvedValue(createdQuote);

            const result = await quoteService.createQuote(quoteData);

            expect(result).toEqual(createdQuote);
            expect(mockQuote.create).toHaveBeenCalledWith({ data: quoteData });
        });

        it('should throw a ZodError for invalid quote data', async () => {
            const quoteData = { bookId: 'invalid', content: null };
            await expect(quoteService.createQuote(quoteData as any)).rejects.toThrow(z.ZodError); 
            expect(mockQuote.create).not.toHaveBeenCalled();
        });
    });

    describe('getQuoteById', () => {
        it('should return a quote when it exists', async () => {
            const quote = { id: 1, bookId: 1, content: 'Test Quote Content', createdAt: new Date(), updatedAt: new Date(), book: null };
            mockQuote.findUnique.mockResolvedValue(quote);

            const result = await quoteService.getQuoteById(1);

            expect(result).toEqual(quote);
            expect(mockQuote.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, include: { book: true } });
        });

        it('should return null when the quote does not exist', async () => {
            mockQuote.findUnique.mockResolvedValue(null);

            const result = await quoteService.getQuoteById(2);

            expect(result).toBeNull();
            expect(mockQuote.findUnique).toHaveBeenCalledWith({ where: { id: 2 }, include: { book: true } });
        });

        it('should throw a ZodError for invalid quote ID', async () => {
            await expect(quoteService.getQuoteById('invalid' as any)).rejects.toThrow(z.ZodError); 
            expect(mockQuote.findUnique).not.toHaveBeenCalled();
        });
    });

    describe('getAllQuotes', () => {
        it('should return all quotes', async () => {
            const quotes = [
                { id: 1, bookId: 1, content: 'Quote 1', createdAt: new Date(), updatedAt: new Date(), book: null },
                { id: 2, bookId: 2, content: 'Quote 2', createdAt: new Date(), updatedAt: new Date(), book: null },
            ];
            mockQuote.findMany.mockResolvedValue(quotes);

            const result = await quoteService.getAllQuotes();

            expect(result).toEqual(quotes);
            expect(mockQuote.findMany).toHaveBeenCalledWith({ include: { book: true } });
        });
    });

    describe('updateQuote', () => {
        it('should update a quote successfully', async () => {
            const updatedQuoteData = { bookId: 2, content: 'Updated Quote Content' };
            const updatedQuote = { id: 1, ...updatedQuoteData, createdAt: new Date(), updatedAt: new Date(), book: null };
            mockQuote.update.mockResolvedValue(updatedQuote);

            const result = await quoteService.updateQuote(1, updatedQuoteData);

            expect(result).toEqual(updatedQuote);
            expect(mockQuote.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updatedQuoteData, include: { book: true } });
        });

        it('should throw a ZodError for invalid update data', async () => {
            const invalidData = { bookId: 'invalid', content: null };
            await expect(quoteService.updateQuote(1, invalidData as any)).rejects.toThrow(z.ZodError);
            expect(mockQuote.update).not.toHaveBeenCalled();
        });
    });

    describe('deleteQuote', () => {
        it('should delete a quote successfully', async () => {
            const deletedQuote = { id: 1, bookId: 1, content: 'Test Quote Content', createdAt: new Date(), updatedAt: new Date() };
            mockQuote.delete.mockResolvedValue(deletedQuote);

            const result = await quoteService.deleteQuote(1);

            expect(result).toEqual(deletedQuote);
            expect(mockQuote.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw a ZodError for invalid quote ID', async () => {
            await expect(quoteService.deleteQuote('invalid' as any)).rejects.toThrow(z.ZodError);
            expect(mockQuote.delete).not.toHaveBeenCalled();
        });
    });
});