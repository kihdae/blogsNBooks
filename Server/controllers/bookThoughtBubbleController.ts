import { Request, Response } from "express";
import bookThoughtBubbleService from "../services/bookThoughtBubbleService";
import { BookThoughtBubble, Book } from "@prisma/client";

type BookThoughtBubbleWithRelations = BookThoughtBubble & {
  book: Book;
};

class BookThoughtBubbleController {
  async createBookThoughtBubble(req: Request, res: Response) {
    try {
      const bookThoughtBubble = await bookThoughtBubbleService.createBookThoughtBubble(req.body);
      res.status(201).json(bookThoughtBubble);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getBookThoughtBubbleById(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const bookThoughtBubble = await bookThoughtBubbleService.getBookThoughtBubbleById(id);
      if (bookThoughtBubble) {
        res.json(bookThoughtBubble);
      } else {
        res.status(404).json({ error: "Book thought bubble not found" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllBookThoughtBubbles(req: Request, res: Response) {
    try {
      const bookThoughtBubbles = await bookThoughtBubbleService.getAllBookThoughtBubbles();
      res.json(bookThoughtBubbles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateBookThoughtBubble(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const bookThoughtBubble = await bookThoughtBubbleService.updateBookThoughtBubble(id, req.body);
      res.json(bookThoughtBubble);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteBookThoughtBubble(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await bookThoughtBubbleService.deleteBookThoughtBubble(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new BookThoughtBubbleController();