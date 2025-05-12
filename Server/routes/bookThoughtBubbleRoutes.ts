import express from 'express';
import bookThoughtBubbleController from '../controllers/bookThoughtBubbleController';

 const router = express.Router();

router.post('/', bookThoughtBubbleController.createBookThoughtBubble);
router.get('/:id', bookThoughtBubbleController.getBookThoughtBubbleById);
router.get('/', bookThoughtBubbleController.getAllBookThoughtBubbles);
router.put('/:id', bookThoughtBubbleController.updateBookThoughtBubble);
router.delete('/:id', bookThoughtBubbleController.deleteBookThoughtBubble);

export default router;