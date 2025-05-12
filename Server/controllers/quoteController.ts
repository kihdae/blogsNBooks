import { Request, Response } from "express";
import quoteService from "../services/quoteService";

class QuoteController {
  async createQuote(req: Request, res: Response) {
    try {
      const quote = await quoteService.createQuote(req.body);
      res.status(201).json(quote);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getQuoteById(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const quote = await quoteService.getQuoteById(id);
      if (quote) {
        res.json(quote);
      } else {
        res.status(404).json({ error: "Quote not found" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllQuotes(req: Request, res: Response) {
    try {
      const quotes = await quoteService.getAllQuotes();
      res.json(quotes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateQuote(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const quote = await quoteService.updateQuote(id, req.body);
      res.json(quote);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteQuote(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await quoteService.deleteQuote(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new QuoteController();
