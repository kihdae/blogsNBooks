import { Request, Response } from "express";
import blogPostService from "../services/blogPostService";
import { BlogPost, BlogPostThoughtBubble } from "@prisma/client";

type BlogPostWithRelations = BlogPost & {
  blogPostThoughtBubbles: BlogPostThoughtBubble[];
};

class BlogPostController {
  async createBlogPost(req: Request, res: Response) {
    try {
      const blogPost = await blogPostService.createBlogPost(req.body);
      res.status(201).json(blogPost);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllBlogPosts(req: Request, res: Response) {
    try {
      const blogPosts: BlogPostWithRelations[] = await blogPostService.getAllBlogPosts();
      res.json(blogPosts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBlogPostById(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const blogPost: BlogPostWithRelations | null = await blogPostService.getBlogPostById(id);
      if (blogPost) {
        res.json(blogPost);
      } else {
        res.status(404).json({ error: "Blog post not found" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateBlogPost(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const blogPost = await blogPostService.updateBlogPost(id, req.body);
      res.json(blogPost);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteBlogPost(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await blogPostService.deleteBlogPost(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new BlogPostController();