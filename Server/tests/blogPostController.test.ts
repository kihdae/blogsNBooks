// __tests__/blogPostController.test.ts
import { Request, Response } from 'express';
import  blogPostController  from '../controllers/blogPostController';
import blogPostService from '../services/blogPostService';

jest.mock('../services/blogPostService');

describe('BlogPostController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockBlogPostService: any;
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
        mockBlogPostService = blogPostService as any;
        jest.clearAllMocks();
    });

    describe('createBlogPost', () => {
        it('should create a blog post successfully', async () => {
            const blogPostData = { title: 'Test Post', content: 'Test Content' };
            mockRequest.body = blogPostData;
            const createdBlogPost = { id: 1, ...blogPostData, createdAt: new Date(), updatedAt: new Date() };
            mockBlogPostService.createBlogPost.mockResolvedValue(createdBlogPost);

            await blogPostController.createBlogPost(mockRequest as Request, mockResponse as Response);

            expect(mockBlogPostService.createBlogPost).toHaveBeenCalledWith(blogPostData);
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(createdBlogPost);
        });

        it('should return a 400 error for invalid data', async () => {
            mockBlogPostService.createBlogPost.mockRejectedValue(new Error('Invalid data'));

            await blogPostController.createBlogPost(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid data' });
        });
    });

    describe('getBlogPostById', () => {
        it('should return a blog post when it exists', async () => {
            mockRequest.params = { id: '1' };
            const blogPost = { id: 1, title: 'Test Post', createdAt: new Date(), updatedAt: new Date(), thoughtBubbles: [] };
            mockBlogPostService.getBlogPostById.mockResolvedValue(blogPost);

            await blogPostController.getBlogPostById(mockRequest as Request, mockResponse as Response);

            expect(mockBlogPostService.getBlogPostById).toHaveBeenCalledWith(1);
            expect(jsonMock).toHaveBeenCalledWith(blogPost);
        });

        it('should return a 404 error when the blog post does not exist', async () => {
            mockRequest.params = { id: '2' };
            mockBlogPostService.getBlogPostById.mockResolvedValue(null);

            await blogPostController.getBlogPostById(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Blog post not found' });
        });

        it('should return a 400 error for invalid ID', async () => {
            mockRequest.params = { id: 'invalid' };

            await blogPostController.getBlogPostById(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid ID' });
        });
    });

    describe('getAllBlogPosts', () => {
        it('should return all blog posts', async () => {
            const blogPosts = [{ id: 1, title: 'Post 1', thoughtBubbles: [] }, { id: 2, title: 'Post 2', thoughtBubbles: [] }];
            mockBlogPostService.getAllBlogPosts.mockResolvedValue(blogPosts);

            await blogPostController.getAllBlogPosts(mockRequest as Request, mockResponse as Response);

            expect(mockBlogPostService.getAllBlogPosts).toHaveBeenCalled();
            expect(jsonMock).toHaveBeenCalledWith(blogPosts);
        });

        it('should return a 500 error on service failure', async () => {
            mockBlogPostService.getAllBlogPosts.mockRejectedValue(new Error('Service error'));

            await blogPostController.getAllBlogPosts(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Service error' });
        });
    });

    describe('updateBlogPost', () => {
        it('should update a blog post successfully', async () => {
            mockRequest.params = { id: '1' };
            const updatedBlogPostData = { title: 'Updated Post' };
            mockRequest.body = updatedBlogPostData;
            const updatedBlogPost = { id: 1, ...updatedBlogPostData, createdAt: new Date(), updatedAt: new Date() };
            mockBlogPostService.updateBlogPost.mockResolvedValue(updatedBlogPost);

            await blogPostController.updateBlogPost(mockRequest as Request, mockResponse as Response);

            expect(mockBlogPostService.updateBlogPost).toHaveBeenCalledWith(1, updatedBlogPostData);
            expect(jsonMock).toHaveBeenCalledWith(updatedBlogPost);
        });

        it('should return a 400 error for invalid update data', async () => {
            mockBlogPostService.updateBlogPost.mockRejectedValue(new Error('Invalid update data'));

            await blogPostController.updateBlogPost(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid update data' });
        });
    });

    describe('deleteBlogPost', () => {
        it('should delete a blog post successfully', async () => {
            mockRequest.params = { id: '1' };
            mockBlogPostService.deleteBlogPost.mockResolvedValue({});

            await blogPostController.deleteBlogPost(mockRequest as Request, mockResponse as Response);

            expect(mockBlogPostService.deleteBlogPost).toHaveBeenCalledWith(1);
            expect(statusMock).toHaveBeenCalledWith(204);
            expect(sendMock).toHaveBeenCalled();
        });

        it('should return a 400 error for invalid delete request', async () => {
            mockRequest.params = { id: 'invalid' };

            await blogPostController.deleteBlogPost(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid ID' });
        });
    });
});