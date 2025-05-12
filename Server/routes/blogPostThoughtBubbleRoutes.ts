import express from 'express';
import blogPostThoughtBubbleController from '../controllers/blogPostThoughtBubbleController';

const router = express.Router();

router.post('/', blogPostThoughtBubbleController.createBlogPostThoughtBubble);
router.get('/:id', blogPostThoughtBubbleController.getBlogPostThoughtBubbleById);
router.get('/', blogPostThoughtBubbleController.getAllBlogPostThoughtBubbles);
router.put('/:id', blogPostThoughtBubbleController.updateBlogPostThoughtBubble);
router.delete('/:id', blogPostThoughtBubbleController.deleteBlogPostThoughtBubble);

export default router;