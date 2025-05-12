import { Request, Response } from 'express';
import authorController from '../controllers/authorController';
import authorService from '../services/authorService';

jest.mock('../services/authorService');

describe('AuthorController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockAuthorService: any;
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
        mockAuthorService = authorService as any;
        jest.clearAllMocks();
    });

    describe('createAuthor', () => {
        it('should create an author successfully', async () => {
            mockRequest.body = { name: 'Test Author', imageUrl: 'http://example.com/image.jpg' };
            const createdAuthor = { id: 1, ...mockRequest.body, createdAt: new Date(), updatedAt: new Date() };
            mockAuthorService.createAuthor.mockResolvedValue(createdAuthor);

            await authorController.createAuthor(mockRequest as Request, mockResponse as Response);

            expect(mockAuthorService.createAuthor).toHaveBeenCalledWith(mockRequest.body);
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(createdAuthor);
        });

        it('should return a 400 error for invalid data', async () => {
            mockAuthorService.createAuthor.mockRejectedValue(new Error('Invalid data'));

            await authorController.createAuthor(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid data' });
        });
    });

    describe('getAuthorById', () => {
        it('should return an author when it exists', async () => {
            mockRequest.params = { id: '1' };
            const author = { id: 1, name: 'Test Author', createdAt: new Date(), updatedAt: new Date() };
            mockAuthorService.getAuthorById.mockResolvedValue(author);

            await authorController.getAuthorById(mockRequest as Request, mockResponse as Response);

            expect(mockAuthorService.getAuthorById).toHaveBeenCalledWith(1);
            expect(jsonMock).toHaveBeenCalledWith(author);
        });

        it('should return a 404 error when the author does not exist', async () => {
            mockRequest.params = { id: '2' };
            mockAuthorService.getAuthorById.mockResolvedValue(null);

            await authorController.getAuthorById(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Author not found' });
        });

        it('should return a 400 error for invalid ID', async () => {
            mockRequest.params = { id: 'invalid' };

            await authorController.getAuthorById(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid ID' });
        });
    });

    describe('getAllAuthors', () => {
        it('should return all authors', async () => {
            const authors = [{ id: 1, name: 'Author 1' }, { id: 2, name: 'Author 2' }];
            mockAuthorService.getAllAuthors.mockResolvedValue(authors);

            await authorController.getAllAuthors(mockRequest as Request, mockResponse as Response);

            expect(mockAuthorService.getAllAuthors).toHaveBeenCalled();
            expect(jsonMock).toHaveBeenCalledWith(authors);
        });

        it('should return a 500 error on service failure', async () => {
            mockAuthorService.getAllAuthors.mockRejectedValue(new Error('Service error'));

            await authorController.getAllAuthors(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Service error' });
        });
    });

    describe('updateAuthor', () => {
        it('should update an author successfully', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = { name: 'Updated Author' };
            const updatedAuthor = { id: 1, ...mockRequest.body, createdAt: new Date(), updatedAt: new Date() };
            mockAuthorService.updateAuthor.mockResolvedValue(updatedAuthor);

            await authorController.updateAuthor(mockRequest as Request, mockResponse as Response);

            expect(mockAuthorService.updateAuthor).toHaveBeenCalledWith(1, mockRequest.body);
            expect(jsonMock).toHaveBeenCalledWith(updatedAuthor);
        });

        it('should return a 400 error for invalid update data', async () => {
            mockRequest.params = { id: '1' };
            mockAuthorService.updateAuthor.mockRejectedValue(new Error('Invalid update data'));

            await authorController.updateAuthor(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid update data' });
        });
    });

    describe('deleteAuthor', () => {
        it('should delete an author successfully', async () => {
            mockRequest.params = { id: '1' };
            mockAuthorService.deleteAuthor.mockResolvedValue({});

            await authorController.deleteAuthor(mockRequest as Request, mockResponse as Response);

            expect(mockAuthorService.deleteAuthor).toHaveBeenCalledWith(1);
            expect(statusMock).toHaveBeenCalledWith(204);
            expect(sendMock).toHaveBeenCalled();
        });

        it('should return a 400 error for invalid delete request', async () => {
            mockRequest.params = { id: 'invalid' };

            await authorController.deleteAuthor(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid ID' });
        });
    });
});