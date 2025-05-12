import { Request, Response } from "express";
import bookService from "../services/bookService";
import { Book, BookThoughtBubble } from "@prisma/client";

type BookWithRelations = Book & { bookThoughtBubbles: BookThoughtBubble[] };

class BookController {
  async createBook(req: Request, res: Response) {
    try {
      const book = await bookService.createBook(req.body);
      res.status(201).json(book);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllBooks(req: Request, res: Response) {
    try {
      const books = await bookService.getAllBooks();
      res.json(books);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBookById(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const book = await bookService.getBookById(id);
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ error: "Book not found" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateBook(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const book = await bookService.updateBook(id, req.body);
      res.json(book);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteBook(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await bookService.deleteBook(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new BookController();