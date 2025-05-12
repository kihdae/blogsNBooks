import bookThoughtBubbleService from '../services/bookThoughtBubbleService';
import prisma from '../prisma/PrismaConnect';
import { BookThoughtBubble, Author } from '@prisma/client';

describe('BookThoughtBubbleService', () => {
    let createdBookThoughtBubble: BookThoughtBubble;
    let testAuthor: Author;
    let testBookId: number;

    beforeAll(async () => {
        testAuthor = await prisma.author.create({
            data: {
                name: 'Test Author',
            },
        });

        const testBook = await prisma.book.create({
            data: {
                title: 'Test Book',
                authorId: testAuthor.id,
            },
        });

        testBookId = testBook.id;

        createdBookThoughtBubble = await prisma.bookThoughtBubble.create({
            data: {
                bookId: testBookId,
                content: 'Test Content',
            },
        });
    });

    afterAll(async () => {
        await prisma.bookThoughtBubble.deleteMany({
            where: {
                bookId: testBookId,
            },
        });

        await prisma.book.deleteMany({
            where: {
                title: 'Test Book',
            },
        });

        await prisma.author.delete({
            where: {
                id: testAuthor.id,
            },
        });
    });

    it('should create a book thought bubble', async () => {
        const newBookThoughtBubble = await bookThoughtBubbleService.createBookThoughtBubble({
            bookId: testBookId,
            content: 'New Content',
        });

        expect(newBookThoughtBubble).toBeDefined();
        expect(newBookThoughtBubble.content).toBe('New Content');

        // Clean up the created thought bubble
        await prisma.bookThoughtBubble.delete({ where: { id: newBookThoughtBubble.id } });
    });

    it('should get a book thought bubble by ID', async () => {
        const bookThoughtBubble = await bookThoughtBubbleService.getBookThoughtBubbleById(createdBookThoughtBubble.id);

        expect(bookThoughtBubble).toBeDefined();
        expect(bookThoughtBubble?.id).toBe(createdBookThoughtBubble.id);
    });

    it('should get all book thought bubbles', async () => {
        const bookThoughtBubbles = await bookThoughtBubbleService.getAllBookThoughtBubbles();

        expect(bookThoughtBubbles).toBeDefined();
        expect(bookThoughtBubbles.length).toBeGreaterThan(0);
    });

    it('should update a book thought bubble', async () => {
        const updatedBookThoughtBubble = await bookThoughtBubbleService.updateBookThoughtBubble(
            createdBookThoughtBubble.id,
            { content: 'Updated Content' }
        );

        expect(updatedBookThoughtBubble).toBeDefined();
        expect(updatedBookThoughtBubble.content).toBe('Updated Content');
    });

    it('should delete a book thought bubble', async () => {
        const newBookThoughtBubble = await prisma.bookThoughtBubble.create({
            data: {
                bookId: testBookId,
                content: 'Temp Content',
            },
        });

        const deletedBookThoughtBubble = await bookThoughtBubbleService.deleteBookThoughtBubble(newBookThoughtBubble.id);

        expect(deletedBookThoughtBubble).toBeDefined();
        expect(deletedBookThoughtBubble.id).toBe(newBookThoughtBubble.id);

        const foundBookThoughtBubble = await prisma.bookThoughtBubble.findUnique({
            where: { id: newBookThoughtBubble.id },
        });
        expect(foundBookThoughtBubble).toBeNull();
    });
});