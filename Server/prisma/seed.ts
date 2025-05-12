// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed ()  {
  try {
    const authors = [
      { name: 'Haruki Murakami' },
      { name: 'Fyodor Dostoevsky' },
      { name: 'Franz Kafka' },
      { name: 'Albert Camus' },
      { name: 'F. Scott Fitzgerald' },
    ];

     await prisma.author.createMany({
      data: authors,
    });

    const authorMap: { [name: string]: number } = {};
    const allAuthors = await prisma.author.findMany();

    allAuthors.forEach(author => {
      authorMap[author.name] = author.id;
    });

    const books = [
      { title: 'Sputnik Sweetheart', authorName: 'Haruki Murakami' },
      { title: 'Dance Dance Dance', authorName: 'Haruki Murakami' },
      { title: 'After Dark', authorName: 'Haruki Murakami' },
      { title: 'The House of the Dead', authorName: 'Fyodor Dostoevsky' },
      { title: 'White Nights', authorName: 'Fyodor Dostoevsky' },
      { title: 'Demons', authorName: 'Fyodor Dostoevsky' },
      { title: 'The Metamorphosis', authorName: 'Franz Kafka' },
      { title: 'The Trial', authorName: 'Franz Kafka' },
      { title: 'Letters to Milena', authorName: 'Franz Kafka' },
      { title: 'The Fall', authorName: 'Albert Camus' },
      { title: 'The Stranger', authorName: 'Albert Camus' },
      { title: 'The Rebel', authorName: 'Albert Camus' },
      { title: 'The Last Tycoon', authorName: 'F. Scott Fitzgerald' },
      { title: 'Tender Is the Night', authorName: 'F. Scott Fitzgerald' },
      { title: 'The Great Gatsby', authorName: 'F. Scott Fitzgerald' },
    ];

    const bookData = books.map(book => ({
      title: book.title,
      authorId: authorMap[book.authorName],
    }));

    await prisma.book.createMany({
      data: bookData,
    });

    console.log('seed data inserted');
  } catch (error) {
    console.error('err seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();