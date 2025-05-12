import express from 'express';
import dotenv from 'dotenv';
import { loginController } from './controllers/adminLoginController';
import bookRoutes from './routes/bookRoutes';
import reviewRoutes from './routes/reviewRoutes';
import blogPostRoutes from './routes/blogPostRoutes';
import authorRoutes from './routes/authorRoutes';
import quoteRoutes from './routes/quoteRoutes';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import bookThoughtBubbleRoutes from './routes/bookThoughtBubbleRoutes';
import blogPostThoughtBubbleRoutes from './routes/blogPostThoughtBubbleRoutes';

dotenv.config();
export const app = express();
const port = 3000;


app.use(express.json());

app.post('/admin/login', loginController);

app.use('/books', bookRoutes);
app.use('/reviews', reviewRoutes);
app.use('/blogposts', blogPostRoutes);
app.use('/authors', authorRoutes);
app.use('/quotes', quoteRoutes);
app.use('/auth', authRoutes);
app.use('/book-thought-bubbles', bookThoughtBubbleRoutes);
app.use('/blog-post-thought-bubbles', blogPostThoughtBubbleRoutes);

app.use('/admin', adminRoutes);

app.listen(port, () => {});
console.log(`go to http://localhost:${port}'`);