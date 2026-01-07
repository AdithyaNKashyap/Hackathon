import { Request, Response } from 'express';
import Category, { ICategory } from '../models/Category';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(parseInt(req.params.id));
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existingCategory = await Category.findByName(name);
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const categoryId = await Category.create({
      name,
      description: description || undefined,
      image: req.file ? `/uploads/${req.file.filename}` : undefined
    });

    const newCategory = await Category.findById(categoryId);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const categoryId = parseInt(req.params.id);

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name && name !== category.name) {
      const existingCategory = await Category.findByName(name);
      if (existingCategory) {
        return res.status(400).json({ message: 'Category name already exists' });
      }
    }

    const updateData = {
      name: name || category.name,
      description: description || category.description,
      image: req.file ? `/uploads/${req.file.filename}` : category.image
    };

    await Category.update(categoryId, updateData);
    const updatedCategory = await Category.findById(categoryId);
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.id);
    
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await Category.delete(categoryId);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};
