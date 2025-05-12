import reviewService from '../services/reviewService';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        review: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('ReviewService', () => {
    let prisma: any;
    let mockReview: any;

    beforeEach(() => {
        prisma = new PrismaClient();
        mockReview = prisma.review;
        jest.clearAllMocks();
    });

    describe('createReview', () => {
        it('should create a review successfully', async () => {
            const reviewData = { bookId: 1, content: 'Test Review Content' };
            const createdReview = { id: 1, ...reviewData, createdAt: new Date(), updatedAt: new Date() };
            mockReview.create.mockResolvedValue(createdReview);

            const result = await reviewService.createReview(reviewData);

            expect(result).toEqual(createdReview);
            expect(mockReview.create).toHaveBeenCalledWith({ data: reviewData });
        });

        it('should throw a ZodError for invalid review data', async () => {
            const reviewData = { bookId: 'invalid', content: null };
            await expect(reviewService.createReview(reviewData as any)).rejects.toThrow(z.ZodError);
            expect(mockReview.create).not.toHaveBeenCalled();
        });
    });

    describe('getReviewById', () => {
        it('should return a review when it exists', async () => {
            const review = { id: 1, bookId: 1, content: 'Test Review Content', createdAt: new Date(), updatedAt: new Date(), book: null };
            mockReview.findUnique.mockResolvedValue(review);

            const result = await reviewService.getReviewById(1);

            expect(result).toEqual(review);
            expect(mockReview.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, include: { book: true } });
        });

        it('should return null when the review does not exist', async () => {
            mockReview.findUnique.mockResolvedValue(null);

            const result = await reviewService.getReviewById(2);

            expect(result).toBeNull();
            expect(mockReview.findUnique).toHaveBeenCalledWith({ where: { id: 2 }, include: { book: true } });
        });

        it('should throw a ZodError for invalid review ID', async () => {
            await expect(reviewService.getReviewById('invalid' as any)).rejects.toThrow(z.ZodError);
            expect(mockReview.findUnique).not.toHaveBeenCalled();
        });
    });

    describe('getAllReviews', () => {
        it('should return all reviews', async () => {
            const reviews = [
                { id: 1, bookId: 1, content: 'Review 1', createdAt: new Date(), updatedAt: new Date(), book: null },
                { id: 2, bookId: 2, content: 'Review 2', createdAt: new Date(), updatedAt: new Date(), book: null },
            ];
            mockReview.findMany.mockResolvedValue(reviews);

            const result = await reviewService.getAllReviews();

            expect(result).toEqual(reviews);
            expect(mockReview.findMany).toHaveBeenCalledWith({ include: { book: true } });
        });
    });

    describe('updateReview', () => {
        it('should update a review successfully', async () => {
            const updatedReviewData = { bookId: 2, content: 'Updated Review Content' };
            const updatedReview = { id: 1, ...updatedReviewData, createdAt: new Date(), updatedAt: new Date(), book: null };
            mockReview.update.mockResolvedValue(updatedReview);

            const result = await reviewService.updateReview(1, updatedReviewData);

            expect(result).toEqual(updatedReview);
            expect(mockReview.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updatedReviewData, include: { book: true } });
        });

        it('should throw a ZodError for invalid update data', async () => {
            const invalidData = { bookId: 'invalid', content: null };
            await expect(reviewService.updateReview(1, invalidData as any)).rejects.toThrow(z.ZodError);
            expect(mockReview.update).not.toHaveBeenCalled();
        });
    });

    describe('deleteReview', () => {
        it('should delete a review successfully', async () => {
            const deletedReview = { id: 1, bookId: 1, content: 'Test Review Content', createdAt: new Date(), updatedAt: new Date() };
            mockReview.delete.mockResolvedValue(deletedReview);

            const result = await reviewService.deleteReview(1);

            expect(result).toEqual(deletedReview);
            expect(mockReview.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw a ZodError for invalid review ID', async () => {
            await expect(reviewService.deleteReview('invalid' as any)).rejects.toThrow(z.ZodError);
            expect(mockReview.delete).not.toHaveBeenCalled();
        });
    });
});