import { Request, Response } from "express";
import authorService from "../services/authorService";

export class AuthorController {
  async createAuthor(req: Request, res: Response) {
    try {
      const author = await authorService.createAuthor(req.body);
      res.status(201).json(author);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAuthorById(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const author = await authorService.getAuthorById(id);
      if (author ) {
        res.json(author);
      } else {
        res.status(404).json({ error: "Author not found" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllAuthors(req: Request, res: Response) {
    try {
      const authors = await authorService.getAllAuthors();
      res.json(authors);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateAuthor(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const author = await authorService.updateAuthor(id, req.body);
      res.json(author);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteAuthor(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await authorService.deleteAuthor(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new AuthorController();
