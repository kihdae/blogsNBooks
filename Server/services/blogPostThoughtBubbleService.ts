import { PrismaClient, BlogPostThoughtBubble, BlogPost } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createBlogPostThoughtBubbleSchema = z.object({
  blogPostId: z.number().int(),
  content: z.string(),
});

type CreateBlogPostThoughtBubbleData = z.infer<typeof createBlogPostThoughtBubbleSchema>;

const updateBlogPostThoughtBubbleSchema = z.object({
  content: z.string().optional(),
});

type UpdateBlogPostThoughtBubbleData = z.infer<typeof updateBlogPostThoughtBubbleSchema>;

type BlogPostThoughtBubbleWithRelations = BlogPostThoughtBubble & {
  blogPost: BlogPost;
};

class BlogPostThoughtBubbleService {
  async createBlogPostThoughtBubble(data: CreateBlogPostThoughtBubbleData): Promise<BlogPostThoughtBubble> {
    createBlogPostThoughtBubbleSchema.parse(data);

    return prisma.blogPostThoughtBubble.create({
      data,
    });
  }

  async getBlogPostThoughtBubbleById(id: number): Promise<BlogPostThoughtBubbleWithRelations | null> {
    const idSchema = z.number().int();
    idSchema.parse(id);

    return prisma.blogPostThoughtBubble.findUnique({
      where: { id },
      include: { blogPost: true },
    });
  }

  async getAllBlogPostThoughtBubbles(): Promise<BlogPostThoughtBubbleWithRelations[]> {
    return prisma.blogPostThoughtBubble.findMany({
      include: { blogPost: true },
    });
  }

  async updateBlogPostThoughtBubble(id: number, data: UpdateBlogPostThoughtBubbleData): Promise<BlogPostThoughtBubble> {
    const idSchema = z.number().int();
    idSchema.parse(id);
    updateBlogPostThoughtBubbleSchema.parse(data);

    return prisma.blogPostThoughtBubble.update({
      where: { id },
      data,
    });
  }

  async deleteBlogPostThoughtBubble(id: number): Promise<BlogPostThoughtBubble> {
    const idSchema = z.number().int();
    idSchema.parse(id);

    return prisma.blogPostThoughtBubble.delete({
      where: { id },
    });
  }
}

export default new BlogPostThoughtBubbleService();