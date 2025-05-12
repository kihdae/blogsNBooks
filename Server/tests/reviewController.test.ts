import { Request, Response } from 'express';
import reviewController from '../controllers/reviewController';
import reviewService from '../services/reviewService';

jest.mock('../services/reviewService');

describe('ReviewController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockReviewService: any;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;
    let sendMock: jest.Mock;

    beforeEach(() => {
        mockRequest = {
            body: {},
            params: {},
        };
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnThis();
        sendMock = jest.fn();
        mockResponse = {
            json: jsonMock,
            status: statusMock,
            send: sendMock,
        };
        mockReviewService = reviewService as any;
        jest.clearAllMocks();
    });

    describe('createReview', () => {
        it('should create a review successfully', async () => {
            const reviewData = { bookId: 1, userId: 1, rating: 5, comment: 'Great book!' };
            mockRequest.body = reviewData;
            const createdReview = { id: 1, ...reviewData, createdAt: new Date(), updatedAt: new Date() };
            mockReviewService.createReview.mockResolvedValue(createdReview);

            await reviewController.createReview(mockRequest as Request, mockResponse as Response);

            expect(mockReviewService.createReview).toHaveBeenCalledWith(reviewData);
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(createdReview);
        });

        it('should return a 400 error for invalid data', async () => {
            mockReviewService.createReview.mockRejectedValue(new Error('Invalid data'));

            await reviewController.createReview(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid data' });
        });
    });

    describe('getReviewById', () => {
        it('should return a review when it exists', async () => {
            mockRequest.params = { id: '1' };
            const review = { id: 1, bookId: 1, userId: 1, rating: 5, comment: 'Great book!', createdAt: new Date(), updatedAt: new Date() };
            mockReviewService.getReviewById.mockResolvedValue(review);

            await reviewController.getReviewById(mockRequest as Request, mockResponse as Response);

            expect(mockReviewService.getReviewById).toHaveBeenCalledWith(1);
            expect(jsonMock).toHaveBeenCalledWith(review);
        });

        it('should return a 404 error when the review does not exist', async () => {
            mockRequest.params = { id: '2' };
            mockReviewService.getReviewById.mockResolvedValue(null);

            await reviewController.getReviewById(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Review not found' });
        });

        it('should return a 400 error for invalid ID', async () => {
            mockRequest.params = { id: 'invalid' };

            await reviewController.getReviewById(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid ID' });
        });
    });

    describe('getAllReviews', () => {
        it('should return all reviews', async () => {
            const reviews = [{ id: 1, bookId: 1, userId: 1, rating: 5, comment: 'Review 1' }, { id: 2, bookId: 2, userId: 2, rating: 4, comment: 'Review 2' }];
            mockReviewService.getAllReviews.mockResolvedValue(reviews);

            await reviewController.getAllReviews(mockRequest as Request, mockResponse as Response);

            expect(mockReviewService.getAllReviews).toHaveBeenCalled();
            expect(jsonMock).toHaveBeenCalledWith(reviews);
        });

        it('should return a 500 error on service failure', async () => {
            mockReviewService.getAllReviews.mockRejectedValue(new Error('Service error'));

            await reviewController.getAllReviews(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Service error' });
        });
    });

    describe('updateReview', () => {
        it('should update a review successfully', async () => {
            mockRequest.params = { id: '1' };
            const updatedReviewData = { rating: 4, comment: 'Updated review' };
            mockRequest.body = updatedReviewData;
            const updatedReview = { id: 1, ...updatedReviewData, createdAt: new Date(), updatedAt: new Date() };
            mockReviewService.updateReview.mockResolvedValue(updatedReview);

            await reviewController.updateReview(mockRequest as Request, mockResponse as Response);

            expect(mockReviewService.updateReview).toHaveBeenCalledWith(1, updatedReviewData);
            expect(jsonMock).toHaveBeenCalledWith(updatedReview);
        });

        it('should return a 400 error for invalid update data', async () => {
            mockReviewService.updateReview.mockRejectedValue(new Error('Invalid update data'));

            await reviewController.updateReview(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid update data' });
        });
    });

    describe('deleteReview', () => {
        it('should delete a review successfully', async () => {
            mockRequest.params = { id: '1' };
            mockReviewService.deleteReview.mockResolvedValue({});

            await reviewController.deleteReview(mockRequest as Request, mockResponse as Response);

            expect(mockReviewService.deleteReview).toHaveBeenCalledWith(1);
            expect(statusMock).toHaveBeenCalledWith(204);
            expect(sendMock).toHaveBeenCalled();
        });

        it('should return a 400 error for invalid delete request', async () => {
            mockRequest.params = { id: 'invalid' };

            await reviewController.deleteReview(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid ID' });
        });
    });
});