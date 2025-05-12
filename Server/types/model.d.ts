import { Book as PrismaBook, Review as PrismaReview, BlogPost as PrismaBlogPost, Author as PrismaAuthor, Quote as PrismaQuote, BookThoughtBubble as PrismaBookThoughtBubble, BlogPostThoughtBubble as PrismaBlogPostThoughtBubble, User as PrismaUser } from "@prisma/client";

export type Book = PrismaBook;
export type Review = PrismaReview;
export type BlogPost = PrismaBlogPost;
export type Author = PrismaAuthor;
export type Quote = PrismaQuote;
export type BookThoughtBubble = PrismaBookThoughtBubble;
export type BlogPostThoughtBubble = PrismaBlogPostThoughtBubble;
export type User = PrismaUser;