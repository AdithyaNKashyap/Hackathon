import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category_id, subcategory_id, images, stock, sku } = req.body;
    
    if (!name || !price || !category_id || !subcategory_id) {
      return res.status(400).json({ message: 'Name, price, category_id, and subcategory_id are required' });
    }

    const productId = await Product.create({
      name,
      description: description || null,
      price: parseFloat(price),
      category_id: parseInt(category_id),
      subcategory_id: parseInt(subcategory_id),
      images: images || [],
      stock: parseInt(stock) || 0,
      sku: sku || null
    });

    const newProduct = await Product.findById(productId);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category_id, subcategory_id, images, stock, sku } = req.body;
    const productId = parseInt(req.params.id);

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updated = await Product.update(productId, {
      name,
      description: description || null,
      price: parseFloat(price),
      category_id: parseInt(category_id),
      subcategory_id: parseInt(subcategory_id),
      images: images || [],
      stock: parseInt(stock) || 0,
      sku: sku || null
    });

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await Product.findById(productId);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    
    const deleted = await Product.delete(productId);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};
