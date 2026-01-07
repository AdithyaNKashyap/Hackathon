import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { initDatabase } from './config/database';
import authRoutes from './routes/auth';
import categoryRoutes from './routes/categories';
import subCategoryRoutes from './routes/subCategories';
import productRoutes from './routes/products';
import { authenticate } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/products', productRoutes);
app.get('/api/test-auth', authenticate, (req, res) => {
  res.json({ message: 'Auth middleware is working', user: (req as any).user });
});
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

startServer();
