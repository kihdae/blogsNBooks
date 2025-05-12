import { PrismaClient, BookThoughtBubble, Book } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createBookThoughtBubbleSchema = z.object({
  bookId: z.number().int(),
  content: z.string(),
});

type CreateBookThoughtBubbleData = z.infer<typeof createBookThoughtBubbleSchema>;

const updateBookThoughtBubbleSchema = z.object({
  content: z.string().optional(),
});

type UpdateBookThoughtBubbleData = z.infer<typeof updateBookThoughtBubbleSchema>;

type BookThoughtBubbleWithRelations = BookThoughtBubble & {
  book: Book;
};

class BookThoughtBubbleService {
  async createBookThoughtBubble(data: CreateBookThoughtBubbleData): Promise<BookThoughtBubble> {
    createBookThoughtBubbleSchema.parse(data);

    return prisma.bookThoughtBubble.create({
      data,
    });
  }

  async getBookThoughtBubbleById(id: number): Promise<BookThoughtBubbleWithRelations | null> {
    const idSchema = z.number().int();
    idSchema.parse(id);

    return prisma.bookThoughtBubble.findUnique({
      where: { id },
      include: { book: true },
    });
  }

  async getAllBookThoughtBubbles(): Promise<BookThoughtBubbleWithRelations[]> {
    return prisma.bookThoughtBubble.findMany({
      include: { book: true },
    });
  }

  async updateBookThoughtBubble(id: number, data: UpdateBookThoughtBubbleData): Promise<BookThoughtBubble> {
    const idSchema = z.number().int();
    idSchema.parse(id);
    updateBookThoughtBubbleSchema.parse(data);

    return prisma.bookThoughtBubble.update({
      where: { id },
      data,
    });
  }

  async deleteBookThoughtBubble(id: number): Promise<BookThoughtBubble> {
    const idSchema = z.number().int();
    idSchema.parse(id);

    return prisma.bookThoughtBubble.delete({
      where: { id },
    });
  }
}

export default new BookThoughtBubbleService();