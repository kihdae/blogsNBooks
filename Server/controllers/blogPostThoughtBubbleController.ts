import { Request, Response } from "express";
import blogPostThoughtBubbleService from "../services/blogPostThoughtBubbleService";
import { BlogPostThoughtBubble, BlogPost } from "@prisma/client";

type BlogPostThoughtBubbleWithRelations = BlogPostThoughtBubble & {
  blogPost: BlogPost;
};

class BlogPostThoughtBubbleController {
  async createBlogPostThoughtBubble(req: Request, res: Response) {
    try {
      const blogPostThoughtBubble = await blogPostThoughtBubbleService.createBlogPostThoughtBubble(req.body);
      res.status(201).json(blogPostThoughtBubble);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getBlogPostThoughtBubbleById(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const blogPostThoughtBubble: BlogPostThoughtBubbleWithRelations | null =
        await blogPostThoughtBubbleService.getBlogPostThoughtBubbleById(id);
      if (blogPostThoughtBubble) {
        res.json(blogPostThoughtBubble);
      } else {
        res.status(404).json({ error: "Blog post thought bubble not found" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllBlogPostThoughtBubbles(req: Request, res: Response): Promise<void> {
    try {
      const blogPostThoughtBubbles: BlogPostThoughtBubbleWithRelations[] =
        await blogPostThoughtBubbleService.getAllBlogPostThoughtBubbles();
      res.json(blogPostThoughtBubbles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateBlogPostThoughtBubble(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const blogPostThoughtBubble = await blogPostThoughtBubbleService.updateBlogPostThoughtBubble(id, req.body);
      res.json(blogPostThoughtBubble);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteBlogPostThoughtBubble(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await blogPostThoughtBubbleService.deleteBlogPostThoughtBubble(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new BlogPostThoughtBubbleController();