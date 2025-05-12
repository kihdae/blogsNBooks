import { Book, PrismaClient, Quote } from '@prisma/client';
import { z } from 'zod';

type QuoteWithBook = Quote & { book: Book };

const prisma = new PrismaClient();

const createQuoteSchema = z.object({
  bookId: z.number().int(),
  content: z.string(),
});

type CreateQuoteData = z.infer<typeof createQuoteSchema>;

const updateQuoteSchema = z.object({
  bookId: z.number().int().optional(),
  content: z.string().optional(),
});

type UpdateQuoteData = z.infer<typeof updateQuoteSchema>;

class QuoteService {
  async createQuote(data: CreateQuoteData): Promise<Quote> {
    createQuoteSchema.parse(data);

    return prisma.quote.create({
      data,
    });
  }

  async getQuoteById(id: number): Promise<Quote | null> {
    const idSchema = z.number().int();
    idSchema.parse(id);

    return prisma.quote.findUnique({
      where: { id },
      include: { book: true },
    });
  }

  async getAllQuotes(): Promise<QuoteWithBook[]> {
    return prisma.quote.findMany({
      include: { book: true },
    });
  }

  async updateQuote(id: number, data: UpdateQuoteData): Promise<Quote> {
    const idSchema = z.number().int();
    idSchema.parse(id);
    updateQuoteSchema.parse(data);

    return prisma.quote.update({
      where: { id },
      data,
      include: { book: true },
    });
  }

  async deleteQuote(id: number): Promise<Quote> {
    const idSchema = z.number().int();
    idSchema.parse(id);

    return prisma.quote.delete({
      where: { id },
    });
  }
}

export default new QuoteService();