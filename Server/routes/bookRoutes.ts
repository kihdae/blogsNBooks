import express, {Router} from 'express';
import bookController from '../controllers/bookController';

const router: Router = express.Router();

router.post('/', bookController.createBook);
router.get('/:id', bookController.getBookById);
router.get('/', bookController.getAllBooks);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

export default router;