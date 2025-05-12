import express from 'express';
import  BlogPostController  from '../controllers/blogPostController';

const router = express.Router();

router.post('/', BlogPostController.createBlogPost);
router.get('/:id', BlogPostController.getBlogPostById);
router.get('/', BlogPostController.getAllBlogPosts);
router.put('/:id', BlogPostController.updateBlogPost);
router.delete('/:id', BlogPostController.deleteBlogPost);



export default router;