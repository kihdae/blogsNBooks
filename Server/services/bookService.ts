import { PrismaClient, Book, BookThoughtBubble } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createBookSchema = z.object({
  title: z.string(),
  authorId: z.number().int(),
});

type CreateBookData = z.infer<typeof createBookSchema>;

const updateBookSchema = z.object({
  title: z.string().optional(),
  authorId: z.number().int().optional(),
});

type UpdateBookData = z.infer<typeof updateBookSchema>;

type BookWithRelations = Book & { bookThoughtBubbles: BookThoughtBubble[] };

class BookService {
  async createBook(data: CreateBookData): Promise<Book> {
    createBookSchema.parse(data);

    return prisma.book.create({
      data,
    });
  }

  async getBookById(id: number): Promise<BookWithRelations | null> {
    const idSchema = z.number().int();
    idSchema.parse(id);

    return prisma.book.findUnique({
      where: { id },
      include: { author: true, reviews: true, blogposts: true, bookThoughtBubbles: true },
    });
  }

  async getAllBooks(): Promise<BookWithRelations[]> {
    return prisma.book.findMany({
      include: { author: true, bookThoughtBubbles: true },
    });
  }

  async updateBook(id: number, data: UpdateBookData): Promise<Book> {
    const idSchema = z.number().int();
    idSchema.parse(id);
    updateBookSchema.parse(data);

    return prisma.book.update({
      where: { id },
      data,
      include: { author: true },
    });
  }

  async deleteBook(id: number): Promise<Book> {
    const idSchema = z.number().int();
    idSchema.parse(id);

    return prisma.book.delete({
      where: { id },
    });
  }
}

export default new BookService();