import { Request, Response } from 'express';
import quoteController from '../controllers/quoteController';
import quoteService from '../services/quoteService';

jest.mock('../services/quoteService');

describe('QuoteController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockQuoteService: any;
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
        mockQuoteService = quoteService as any;
        jest.clearAllMocks();
    });

    describe('createQuote', () => {
        it('should create a quote successfully', async () => {
            const quoteData = { text: 'Test Quote', author: 'Test Author' };
            mockRequest.body = quoteData;
            const createdQuote = { id: 1, ...quoteData, createdAt: new Date(), updatedAt: new Date() };
            mockQuoteService.createQuote.mockResolvedValue(createdQuote);

            await quoteController.createQuote(mockRequest as Request, mockResponse as Response);

            expect(mockQuoteService.createQuote).toHaveBeenCalledWith(quoteData);
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(createdQuote);
        });

        it('should return a 400 error for invalid data', async () => {
            mockQuoteService.createQuote.mockRejectedValue(new Error('Invalid data'));

            await quoteController.createQuote(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid data' });
        });
    });

    describe('getQuoteById', () => {
        it('should return a quote when it exists', async () => {
            mockRequest.params = { id: '1' };
            const quote = { id: 1, text: 'Test Quote', author: 'Test Author', createdAt: new Date(), updatedAt: new Date() };
            mockQuoteService.getQuoteById.mockResolvedValue(quote);

            await quoteController.getQuoteById(mockRequest as Request, mockResponse as Response);

            expect(mockQuoteService.getQuoteById).toHaveBeenCalledWith(1);
            expect(jsonMock).toHaveBeenCalledWith(quote);
        });

        it('should return a 404 error when the quote does not exist', async () => {
            mockRequest.params = { id: '2' };
            mockQuoteService.getQuoteById.mockResolvedValue(null);

            await quoteController.getQuoteById(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Quote not found' });
        });

        it('should return a 400 error for invalid ID', async () => {
            mockRequest.params = { id: 'invalid' };

            await quoteController.getQuoteById(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid ID' });
        });
    });

    describe('getAllQuotes', () => {
        it('should return all quotes', async () => {
            const quotes = [{ id: 1, text: 'Quote 1' }, { id: 2, text: 'Quote 2' }];
            mockQuoteService.getAllQuotes.mockResolvedValue(quotes);

            await quoteController.getAllQuotes(mockRequest as Request, mockResponse as Response);

            expect(mockQuoteService.getAllQuotes).toHaveBeenCalled();
            expect(jsonMock).toHaveBeenCalledWith(quotes);
        });

        it('should return a 500 error on service failure', async () => {
            mockQuoteService.getAllQuotes.mockRejectedValue(new Error('Service error'));

            await quoteController.getAllQuotes(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Service error' });
        });
    });

    describe('updateQuote', () => {
        it('should update a quote successfully', async () => {
            mockRequest.params = { id: '1' };
            const updatedQuoteData = { text: 'Updated Quote' };
            mockRequest.body = updatedQuoteData;
            const updatedQuote = { id: 1, ...updatedQuoteData, createdAt: new Date(), updatedAt: new Date() };
            mockQuoteService.updateQuote.mockResolvedValue(updatedQuote);

            await quoteController.updateQuote(mockRequest as Request, mockResponse as Response);

            expect(mockQuoteService.updateQuote).toHaveBeenCalledWith(1, updatedQuoteData);
            expect(jsonMock).toHaveBeenCalledWith(updatedQuote);
        });

        it('should return a 400 error for invalid update data', async () => {
            mockQuoteService.updateQuote.mockRejectedValue(new Error('Invalid update data'));

            await quoteController.updateQuote(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid update data' });
        });
    });

    describe('deleteQuote', () => {
        it('should delete a quote successfully', async () => {
            mockRequest.params = { id: '1' };
            mockQuoteService.deleteQuote.mockResolvedValue({});

            await quoteController.deleteQuote(mockRequest as Request, mockResponse as Response);

            expect(mockQuoteService.deleteQuote).toHaveBeenCalledWith(1);
            expect(statusMock).toHaveBeenCalledWith(204);
            expect(sendMock).toHaveBeenCalled();
        });

        it('should return a 400 error for invalid delete request', async () => {
            mockRequest.params = { id: 'invalid' };

            await quoteController.deleteQuote(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid ID' });
        });
    });
});