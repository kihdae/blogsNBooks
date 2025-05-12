import { Request, Response } from "express";
import reviewService from "../services/reviewService";

class ReviewController {
  async createReview(req: Request, res: Response) {
    try {
      const review = await reviewService.createReview(req.body);
      res.status(201).json(review);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getReviewById(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const review = await reviewService.getReviewById(id);
      if (review) {
        res.json(review);
      } else {
        res.status(404).json({ error: "Review not found" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllReviews(req: Request, res: Response) {
    try {
      const reviews = await reviewService.getAllReviews();
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateReview(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const review = await reviewService.updateReview(id, req.body);
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteReview(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await reviewService.deleteReview(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new ReviewController();
