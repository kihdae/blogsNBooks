import blogPostService from '../services/blogPostService';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        blogPost: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('BlogPostService', () => {
    let prisma: any;
    let mockBlogPost: any;

    beforeEach(() => {
        prisma = new PrismaClient();
        mockBlogPost = prisma.blogPost;
        jest.clearAllMocks();
    });

    describe('createBlogPost', () => {
        it('should create a blog post successfully', async () => {
            const blogPostData = { title: 'Test Post', content: 'Test Content', bookId: 1 };
            const createdBlogPost = { id: 1, ...blogPostData, createdAt: new Date(), updatedAt: new Date() };
            mockBlogPost.create.mockResolvedValue(createdBlogPost);

            const result = await blogPostService.createBlogPost(blogPostData);

            expect(result).toEqual(createdBlogPost);
            expect(mockBlogPost.create).toHaveBeenCalledWith({ data: blogPostData });
        });

        it('should throw a ZodError for invalid blog post data', async () => {
            const blogPostData = { title: 123, content: null, bookId: 'invalid' };
            await expect(blogPostService.createBlogPost(blogPostData as any)).rejects.toThrow(z.ZodError);
            expect(mockBlogPost.create).not.toHaveBeenCalled();
        });
    });

    describe('getBlogPostById', () => {
        it('should return a blog post when it exists', async () => {
            const blogPost = { id: 1, title: 'Test Post', content: 'Test Content', createdAt: new Date(), updatedAt: new Date(), book: null, blogPostThoughtBubbles: [] };
            mockBlogPost.findUnique.mockResolvedValue(blogPost);

            const result = await blogPostService.getBlogPostById(1);

            expect(result).toEqual(blogPost);
            expect(mockBlogPost.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, include: { book: true, blogPostThoughtBubbles: true } });
        });

        it('should return null when the blog post does not exist', async () => {
            mockBlogPost.findUnique.mockResolvedValue(null);

            const result = await blogPostService.getBlogPostById(2);

            expect(result).toBeNull();
            expect(mockBlogPost.findUnique).toHaveBeenCalledWith({ where: { id: 2 }, include: { book: true, blogPostThoughtBubbles: true } });
        });

        it('should throw a ZodError for invalid blog post ID', async () => {
            await expect(blogPostService.getBlogPostById('invalid' as any)).rejects.toThrow(z.ZodError);
            expect(mockBlogPost.findUnique).not.toHaveBeenCalled();
        });
    });

    describe('getAllBlogPosts', () => {
        it('should return all blog posts', async () => {
            const blogPosts = [{ id: 1, title: 'Post 1', content: 'Content 1', createdAt: new Date(), updatedAt: new Date(), book: null, blogPostThoughtBubbles: [] }, { id: 2, title: 'Post 2', content: 'Content 2', createdAt: new Date(), updatedAt: new Date(), book: null, blogPostThoughtBubbles: [] }];
            mockBlogPost.findMany.mockResolvedValue(blogPosts);

            const result = await blogPostService.getAllBlogPosts();

            expect(result).toEqual(blogPosts);
            expect(mockBlogPost.findMany).toHaveBeenCalledWith({ include: { book: true, blogPostThoughtBubbles: true } });
        });
    });

    describe('updateBlogPost', () => {
        it('should update a blog post successfully', async () => {
            const updatedBlogPostData = { title: 'Updated Post', content: 'Updated Content', bookId: 2 };
            const updatedBlogPost = { id: 1, ...updatedBlogPostData, createdAt: new Date(), updatedAt: new Date(), book: null };
            mockBlogPost.update.mockResolvedValue(updatedBlogPost);

            const result = await blogPostService.updateBlogPost(1, updatedBlogPostData);

            expect(result).toEqual(updatedBlogPost);
            expect(mockBlogPost.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updatedBlogPostData, include: { book: true } });
        });

        it('should throw a ZodError for invalid update data', async () => {
            const invalidData = { title: 123, content: null, bookId: 'invalid' };
            await expect(blogPostService.updateBlogPost(1, invalidData as any)).rejects.toThrow(z.ZodError);
            expect(mockBlogPost.update).not.toHaveBeenCalled();
        });
    });

    describe('deleteBlogPost', () => {
        it('should delete a blog post successfully', async () => {
            const deletedBlogPost = { id: 1, title: 'Test Post', content: 'Test Content', createdAt: new Date(), updatedAt: new Date() };
            mockBlogPost.delete.mockResolvedValue(deletedBlogPost);

            const result = await blogPostService.deleteBlogPost(1);

            expect(result).toEqual(deletedBlogPost);
            expect(mockBlogPost.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw a ZodError for invalid blog post ID', async () => {
            await expect(blogPostService.deleteBlogPost('invalid' as any)).rejects.toThrow(z.ZodError);
            expect(mockBlogPost.delete).not.toHaveBeenCalled();
        });
    });
});
