import { Request, Response } from 'express';
import bookController from '../controllers/bookController';
import bookService from '../services/bookService';

jest.mock('../services/bookService');

describe('BookController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockBookService: any;
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
        mockBookService = bookService as any;
        jest.clearAllMocks();
    });

    describe('createBook', () => {
        it('should create a book successfully', async () => {
            const bookData = { title: 'Test Book', authorId: 1 };
            mockRequest.body = bookData;
            const createdBook = { id: 1, ...bookData, createdAt: new Date(), updatedAt: new Date() };
            mockBookService.createBook.mockResolvedValue(createdBook);

            await bookController.createBook(mockRequest as Request, mockResponse as Response);

            expect(mockBookService.createBook).toHaveBeenCalledWith(bookData);
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(createdBook);
        });

        it('should return a 400 error for invalid data', async () => {
            mockBookService.createBook.mockRejectedValue(new Error('Invalid data'));

            await bookController.createBook(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid data' });
        });
    });

    describe('getBookById', () => {
        it('should return a book when it exists', async () => {
            mockRequest.params = { id: '1' };
            const book = { id: 1, title: 'Test Book', authorId: 1, createdAt: new Date(), updatedAt: new Date() };
            mockBookService.getBookById.mockResolvedValue(book);

            await bookController.getBookById(mockRequest as Request, mockResponse as Response);

            expect(mockBookService.getBookById).toHaveBeenCalledWith(1);
            expect(jsonMock).toHaveBeenCalledWith(book);
        });

        it('should return a 404 error when the book does not exist', async () => {
            mockRequest.params = { id: '2' };
            mockBookService.getBookById.mockResolvedValue(null);

            await bookController.getBookById(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Book not found' });
        });

        it('should return a 400 error for invalid ID', async () => {
            mockRequest.params = { id: 'invalid' };

            await bookController.getBookById(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid ID' });
        });
    });

    describe('getAllBooks', () => {
        it('should return all books', async () => {
            const books = [{ id: 1, title: 'Book 1' }, { id: 2, title: 'Book 2' }];
            mockBookService.getAllBooks.mockResolvedValue(books);

            await bookController.getAllBooks(mockRequest as Request, mockResponse as Response);

            expect(mockBookService.getAllBooks).toHaveBeenCalled();
            expect(jsonMock).toHaveBeenCalledWith(books);
        });

        it('should return a 500 error on service failure', async () => {
            mockBookService.getAllBooks.mockRejectedValue(new Error('Service error'));

            await bookController.getAllBooks(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Service error' });
        });
    });

    describe('updateBook', () => {
        it('should update a book successfully', async () => {
            mockRequest.params = { id: '1' };
            const updatedBookData = { title: 'Updated Book' };
            mockRequest.body = updatedBookData;
            const updatedBook = { id: 1, ...updatedBookData, createdAt: new Date(), updatedAt: new Date() };
            mockBookService.updateBook.mockResolvedValue(updatedBook);

            await bookController.updateBook(mockRequest as Request, mockResponse as Response);

            expect(mockBookService.updateBook).toHaveBeenCalledWith(1, updatedBookData);
            expect(jsonMock).toHaveBeenCalledWith(updatedBook);
        });

        it('should return a 400 error for invalid update data', async () => {
            mockBookService.updateBook.mockRejectedValue(new Error('Invalid update data'));

            await bookController.updateBook(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid update data' });
        });
    });

    describe('deleteBook', () => {
        it('should delete a book successfully', async () => {
            mockRequest.params = { id: '1' };
            mockBookService.deleteBook.mockResolvedValue({});

            await bookController.deleteBook(mockRequest as Request, mockResponse as Response);

            expect(mockBookService.deleteBook).toHaveBeenCalledWith(1);
            expect(statusMock).toHaveBeenCalledWith(204);
            expect(sendMock).toHaveBeenCalled();
        });

        it('should return a 400 error for invalid delete request', async () => {
            mockRequest.params = { id: 'invalid' };

            await bookController.deleteBook(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid ID' });
        });
    });
});