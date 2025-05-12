import { PrismaClient, Review } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createReviewSchema = z.object({
  bookId: z.number().int(),
  content: z.string(),
});

type CreateReviewData = z.infer<typeof createReviewSchema>;

const updateReviewSchema = z.object({
  bookId: z.number().int().optional(),
  content: z.string().optional(),
});

type UpdateReviewData = z.infer<typeof updateReviewSchema>;

class ReviewService {
  async createReview(data: CreateReviewData): Promise<Review> {
    createReviewSchema.parse(data);

    return prisma.review.create({
      data,
    });
  }

  async getReviewById(id: number): Promise<Review | null> {
    const idSchema = z.number().int();
    idSchema.parse(id);

    return prisma.review.findUnique({
      where: { id },
      include: { book: true },
    });
  }

  async getAllReviews(): Promise<Review[]> {
    return prisma.review.findMany({
      include: { book: true },
    });
  }

  async updateReview(id: number, data: UpdateReviewData): Promise<Review> {
    const idSchema = z.number().int();
    idSchema.parse(id);
    updateReviewSchema.parse(data);

    return prisma.review.update({
      where: { id },
      data,
      include: { book: true },
    });
  }

  async deleteReview(id: number): Promise<Review> {
    const idSchema = z.number().int();
    idSchema.parse(id);

    return prisma.review.delete({
      where: { id },
    });
  }
}

export default new ReviewService();