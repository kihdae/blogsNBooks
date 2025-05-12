import { PrismaClient, BlogPost, BlogPostThoughtBubble } from '@prisma/client';
import { z } from 'zod';

type BlogPostWithRelations = BlogPost & { blogPostThoughtBubbles: BlogPostThoughtBubble[] };

const prisma = new PrismaClient();

const createBlogPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  bookId: z.number().int().nullable(),
});

type CreateBlogPostData = z.infer<typeof createBlogPostSchema>;

const updateBlogPostSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  bookId: z.number().int().nullable().optional(),
});

type UpdateBlogPostData = z.infer<typeof updateBlogPostSchema>;

class BlogPostService {
  async createBlogPost(data: CreateBlogPostData): Promise<BlogPost> {
    createBlogPostSchema.parse(data);

    return prisma.blogPost.create({
      data,
    });
  }

  async getBlogPostById(id: number): Promise<BlogPostWithRelations | null> {
    const idSchema = z.number().int();
    idSchema.parse(id);

    return prisma.blogPost.findUnique({
      where: { id },
      include: { book: true, blogPostThoughtBubbles: true },
    });
  }

  async getAllBlogPosts(): Promise<BlogPostWithRelations[]> {
    return prisma.blogPost.findMany({
      include: { book: true, blogPostThoughtBubbles: true },
    });
  }

  async updateBlogPost(id: number, data: UpdateBlogPostData): Promise<BlogPost> {
    const idSchema = z.number().int();
    idSchema.parse(id);
    updateBlogPostSchema.parse(data);

    return prisma.blogPost.update({
      where: { id },
      data,
      include: { book: true },
    });
  }

  async deleteBlogPost(id: number): Promise<BlogPost> {
    const idSchema = z.number().int();
    idSchema.parse(id);

    return prisma.blogPost.delete({
      where: { id },
    });
  }
}

export default new BlogPostService();