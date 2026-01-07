import { Router } from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticate } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configure multer for multiple file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Apply authentication middleware to all routes (temporarily disabled for testing)
// router.use(authenticate);

// Routes
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', upload.array('images', 5), createProduct); // Allow up to 5 images
router.put('/:id', upload.array('images', 5), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
