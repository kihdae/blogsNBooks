import express from 'express';
import authorController from '../controllers/authorController';

const router = express.Router();

router.post('/', authorController.createAuthor);
router.get('/:id', authorController.getAuthorById);
router.get('/', authorController.getAllAuthors);
router.put('/:id', authorController.updateAuthor);
router.delete('/:id', authorController.deleteAuthor);

export default router;