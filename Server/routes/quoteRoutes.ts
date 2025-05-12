import express from 'express';
import quoteController from '../controllers/quoteController';

const router = express.Router();

router.post('/', quoteController.createQuote);
router.get('/:id', quoteController.getQuoteById);
router.get('/', quoteController.getAllQuotes);
router.put('/:id', quoteController.updateQuote);
router.delete('/:id', quoteController.deleteQuote);

export default router;