// blogPostThoughtBubbleController.test.ts
import { Request, Response } from 'express';
import blogPostThoughtBubbleController from '../controllers/blogPostThoughtBubbleController';
import blogPostThoughtBubbleService from '../services/blogPostThoughtBubbleService';
import { BlogPostThoughtBubble } from '@prisma/client';
import { BlogPost } from '../types/model';

jest.mock('../services/blogPostThoughtBubbleService');
const mockedBlogPostThoughtBubbleService = blogPostThoughtBubbleService as jest.Mocked<typeof blogPostThoughtBubbleService>;

type BlogPostThoughtBubbleWithRelations = BlogPostThoughtBubble & {
    blogPost: BlogPost;
};

describe('BlogPostThoughtBubbleController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockSend: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockSend = jest.fn();
    mockStatus = jest.fn().mockReturnThis();

    mockRequest = {};
    mockResponse = {
      json: mockJson,
      send: mockSend,
      status: mockStatus,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBlogPostThoughtBubble', () => {
    it('should create a blog post thought bubble and return 201', async () => {
      const mockData: BlogPostThoughtBubble = {
        id: 1,
        blogPostId: 1,
        content: 'Test Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockedBlogPostThoughtBubbleService.createBlogPostThoughtBubble.mockResolvedValue(mockData);
      mockRequest.body = { blogPostId: 1, content: 'Test Content' };

      await blogPostThoughtBubbleController.createBlogPostThoughtBubble(mockRequest as Request, mockResponse as Response);

      expect(mockedBlogPostThoughtBubbleService.createBlogPostThoughtBubble).toHaveBeenCalledWith(mockRequest.body);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockData);
    });

    it('should return 400 on service error', async () => {
      mockedBlogPostThoughtBubbleService.createBlogPostThoughtBubble.mockRejectedValue(new Error('Service Error'));
      mockRequest.body = { blogPostId: 1, content: 'Test Content' };

      await blogPostThoughtBubbleController.createBlogPostThoughtBubble(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Service Error' });
    });
  });

  describe('getBlogPostThoughtBubbleById', () => {
    it('should get a blog post thought bubble by ID and return it', async () => {
      const mockData: BlogPostThoughtBubbleWithRelations = {
        id: 1,
        blogPostId: 1,
        content: 'Test Content',
        createdAt: new Date(),
        updatedAt: new Date(),
        blogPost: {
          id: 1,
          title: 'Test Blog Post',
          content: 'Blog Post Content',
          createdAt: new Date(),
          updatedAt: new Date(),
          bookId: null,
        } as BlogPost,
      };
      mockedBlogPostThoughtBubbleService.getBlogPostThoughtBubbleById.mockResolvedValue(mockData);
      mockRequest.params = { id: '1' };

      await blogPostThoughtBubbleController.getBlogPostThoughtBubbleById(mockRequest as Request, mockResponse as Response);

      expect(mockedBlogPostThoughtBubbleService.getBlogPostThoughtBubbleById).toHaveBeenCalledWith(1);
      expect(mockJson).toHaveBeenCalledWith(mockData);
    });

    it('should return 404 if blog post thought bubble is not found', async () => {
      mockedBlogPostThoughtBubbleService.getBlogPostThoughtBubbleById.mockResolvedValue(null);
      mockRequest.params = { id: '1' };

      await blogPostThoughtBubbleController.getBlogPostThoughtBubbleById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Blog post thought bubble not found' });
    });

    it('should return 400 for invalid ID', async () => {
      mockRequest.params = { id: 'invalid' };

      await blogPostThoughtBubbleController.getBlogPostThoughtBubbleById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid ID' });
    });

    it('should return 400 on service error', async () => {
      mockedBlogPostThoughtBubbleService.getBlogPostThoughtBubbleById.mockRejectedValue(new Error('Service Error'));
      mockRequest.params = { id: '1' };

      await blogPostThoughtBubbleController.getBlogPostThoughtBubbleById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Service Error' });
    });
  });

  describe('getAllBlogPostThoughtBubbles', () => {
    it('should get all blog post thought bubbles and return them', async () => {
      const mockData: BlogPostThoughtBubbleWithRelations[] = [
        {
          id: 1,
          blogPostId: 1,
          content: 'Test Content 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          blogPost: {
            id: 1,
            title: 'Test Blog Post 1',
            content: 'Blog Post Content 1',
            createdAt: new Date(),
            updatedAt: new Date(),
            bookId: null,
          } as BlogPost,
        },
        {
          id: 2,
          blogPostId: 2,
          content: 'Test Content 2',
          createdAt: new Date(),
          updatedAt: new Date(),
          blogPost: {
            id: 2,
            title: 'Test Blog Post 2',
            content: 'Blog Post Content 2',
            createdAt: new Date(),
            updatedAt: new Date(),
            bookId: null,
          } as BlogPost,
        },
      ];
      mockedBlogPostThoughtBubbleService.getAllBlogPostThoughtBubbles.mockResolvedValue(mockData);

      await blogPostThoughtBubbleController.getAllBlogPostThoughtBubbles(mockRequest as Request, mockResponse as Response);

      expect(mockedBlogPostThoughtBubbleService.getAllBlogPostThoughtBubbles).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(mockData);
    });

    it('should return 500 on service error', async () => {
      mockedBlogPostThoughtBubbleService.getAllBlogPostThoughtBubbles.mockRejectedValue(new Error('Service Error'));

      await blogPostThoughtBubbleController.getAllBlogPostThoughtBubbles(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Service Error' });
    });
  });

  describe('updateBlogPostThoughtBubble', () => {
    it('should update a blog post thought bubble and return it', async () => {
      const mockData: BlogPostThoughtBubble = {
        id: 1,
        blogPostId: 1,
        content: 'Updated Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockedBlogPostThoughtBubbleService.updateBlogPostThoughtBubble.mockResolvedValue(mockData);
      mockRequest.params = { id: '1' };
      mockRequest.body = { content: 'Updated Content' };

      await blogPostThoughtBubbleController.updateBlogPostThoughtBubble(mockRequest as Request, mockResponse as Response);

      expect(mockedBlogPostThoughtBubbleService.updateBlogPostThoughtBubble).toHaveBeenCalledWith(1, mockRequest.body);
      expect(mockJson).toHaveBeenCalledWith(mockData);
    });

    it('should return 400 on service error', async () => {
      mockedBlogPostThoughtBubbleService.updateBlogPostThoughtBubble.mockRejectedValue(new Error('Service Error'));
      mockRequest.params = { id: '1' };
      mockRequest.body = { content: 'Updated Content' };

      await blogPostThoughtBubbleController.updateBlogPostThoughtBubble(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Service Error' });
    });
  });

  describe('deleteBlogPostThoughtBubble', () => {
    it('should delete a blog post thought bubble and return 204', async () => {
      mockedBlogPostThoughtBubbleService.deleteBlogPostThoughtBubble.mockResolvedValue({} as BlogPostThoughtBubble);
      mockRequest.params = { id: '1' };

      await blogPostThoughtBubbleController.deleteBlogPostThoughtBubble(mockRequest as Request, mockResponse as Response);

      expect(mockedBlogPostThoughtBubbleService.deleteBlogPostThoughtBubble).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockSend).toHaveBeenCalled();
    });

    it('should return 400 for invalid ID', async () => {
      mockRequest.params = { id: 'invalid' };

      await blogPostThoughtBubbleController.deleteBlogPostThoughtBubble(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid ID' });
    });

    it('should return 400 on service error', async () => {
      mockedBlogPostThoughtBubbleService.deleteBlogPostThoughtBubble.mockRejectedValue(new Error('Service Error'));
      mockRequest.params = { id: '1' };

      await blogPostThoughtBubbleController.deleteBlogPostThoughtBubble(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Service Error' });
    });
  });
});