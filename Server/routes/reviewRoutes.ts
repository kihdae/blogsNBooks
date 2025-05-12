import express from 'express';
import reviewController from '../controllers/reviewController';

const router = express.Router();

router.post('/', reviewController.createReview);
router.get('/:id', reviewController.getReviewById);
router.get('/', reviewController.getAllReviews);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

export default router;