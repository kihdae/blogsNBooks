import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware';
import authorController from '../controllers/authorController';
import bookController from '../controllers/bookController';
import reviewController from '../controllers/reviewController';
import blogPostController from '../controllers/blogPostController';
import quoteController from '../controllers/quoteController';
import bookThoughtBubbleController from '../controllers/bookThoughtBubbleController';
import blogPostThoughtBubbleController from '../controllers/blogPostThoughtBubbleController';
const router = express.Router();

// applied authentication & authorization middleware to all admin routes
router.use((req, res, next) => {
    authenticateToken(req, res, next);
    return next();
}
);
router.use((req, res, next) => {
  authorizeAdmin(req, res, next);
  return next();
});

router.post('/authors', authorController.createAuthor);
router.get('/authors/:id', authorController.getAuthorById);
router.get('/authors', authorController.getAllAuthors);
router.put('/authors/:id', authorController.updateAuthor);
router.delete('/authors/:id', authorController.deleteAuthor);

router.post('/books', bookController.createBook);
router.get('/books/:id', bookController.getBookById);
router.get('/books', bookController.getAllBooks);
router.put('/books/:id', bookController.updateBook);
router.delete('/books/:id', bookController.deleteBook);

router.post('/reviews', reviewController.createReview);
router.get('/reviews/:id', reviewController.getReviewById);
router.get('/reviews', reviewController.getAllReviews);
router.put('/reviews/:id', reviewController.updateReview);
router.delete('/reviews/:id', reviewController.deleteReview);

router.post('/blogposts', blogPostController.createBlogPost);
router.get('/blogposts/:id', blogPostController.getBlogPostById);
router.get('/blogposts', blogPostController.getAllBlogPosts);
router.put('/blogposts/:id', blogPostController.updateBlogPost);
router.delete('/blogposts/:id', blogPostController.deleteBlogPost);

router.post('/quotes', quoteController.createQuote);
router.get('/quotes/:id', quoteController.getQuoteById);
router.get('/quotes', quoteController.getAllQuotes);
router.put('/quotes/:id', quoteController.updateQuote);
router.delete('/quotes/:id', quoteController.deleteQuote);

router.post('/bookthoughtbubbles', bookThoughtBubbleController.createBookThoughtBubble);
router.get('/bookthoughtbubbles/:id', bookThoughtBubbleController.getBookThoughtBubbleById);
router.get('/bookthoughtbubbles', bookThoughtBubbleController.getAllBookThoughtBubbles);
router.put('/bookthoughtbubbles/:id', bookThoughtBubbleController.updateBookThoughtBubble);
router.delete('/bookthoughtbubbles/:id', bookThoughtBubbleController.deleteBookThoughtBubble);

router.post('/blogpostthoughtbubbles', blogPostThoughtBubbleController.createBlogPostThoughtBubble);
router.get('/blogpostthoughtbubbles/:id', blogPostThoughtBubbleController.getBlogPostThoughtBubbleById);
router.get('/blogpostthoughtbubbles', blogPostThoughtBubbleController.getAllBlogPostThoughtBubbles);
router.put('/blogpostthoughtbubbles/:id', blogPostThoughtBubbleController.updateBlogPostThoughtBubble);
router.delete('/blogpostthoughtbubbles/:id', blogPostThoughtBubbleController.deleteBlogPostThoughtBubble);


export default router;