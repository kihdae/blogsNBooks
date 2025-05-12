import { PrismaClient, Author, Book } from '@prisma/client';
import { z } from 'zod';

type AuthorWithBooks = Author & { books: Book[] };

const prisma = new PrismaClient();

const authorSchema = z.object({
  name: z.string(),
  imageUrl: z.string().url().nullable(),
});

type CreateAuthorData = z.infer<typeof authorSchema>;

const updateAuthorSchema = z.object({
  name: z.string().optional(),
  imageUrl: z.string().url().nullable().optional(),
});

type UpdateAuthorData = z.infer<typeof updateAuthorSchema>;

class AuthorService {
  async createAuthor(data: CreateAuthorData): Promise<Author> {
    authorSchema.parse(data);

    return prisma.author.create({
      data,
    });
  }

  async getAuthorById(id: number): Promise<Author | null> {
    const idSchema = z.number().int();
    idSchema.parse(id);

    return prisma.author.findUnique({
      where: { id },
      include: { books: true },
    });
  }

  async getAllAuthors(): Promise<AuthorWithBooks[]> {
    return prisma.author.findMany({
      include: { books: true },
    });
  }

  async updateAuthor(id: number, data: UpdateAuthorData): Promise<Author> {
    const idSchema = z.number().int();
    idSchema.parse(id);
    updateAuthorSchema.parse(data);

    return prisma.author.update({
      where: { id },
      data,
      include: { books: true },
    });
  }

  async deleteAuthor(id: number): Promise<Author> {
    const idSchema = z.number().int();
    idSchema.parse(id);

    return prisma.author.delete({
      where: { id },
    });
  }
}

export default new AuthorService();