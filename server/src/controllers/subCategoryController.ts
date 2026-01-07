import { Request, Response } from 'express';
import SubCategory, { ISubCategory } from '../models/SubCategory';

export const getSubCategories = async (req: Request, res: Response) => {
  try {
    const subCategories = await SubCategory.findAll();
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const getSubCategory = async (req: Request, res: Response) => {
  try {
    const subCategory = await SubCategory.findById(parseInt(req.params.id));
    if (!subCategory) {
      return res.status(404).json({ message: 'Sub Category not found' });
    }
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const createSubCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, category_id, image } = req.body;
    
    if (!name || !category_id) {
      return res.status(400).json({ message: 'Name and category_id are required' });
    }

    const subCategoryId = await SubCategory.create({
      name,
      description: description || null,
      category_id: parseInt(category_id),
      image: image || null
    });

    const newSubCategory = await SubCategory.findById(subCategoryId);
    res.status(201).json(newSubCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const updateSubCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, category_id, image } = req.body;
    const subCategoryId = parseInt(req.params.id);

    const existingSubCategory = await SubCategory.findById(subCategoryId);
    if (!existingSubCategory) {
      return res.status(404).json({ message: 'Sub Category not found' });
    }

    const updated = await SubCategory.update(subCategoryId, {
      name,
      description: description || null,
      category_id: parseInt(category_id),
      image: image || null
    });

    if (!updated) {
      return res.status(404).json({ message: 'Sub Category not found' });
    }

    const updatedSubCategory = await SubCategory.findById(subCategoryId);
    res.json(updatedSubCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const deleteSubCategory = async (req: Request, res: Response) => {
  try {
    const subCategoryId = parseInt(req.params.id);
    
    const deleted = await SubCategory.delete(subCategoryId);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Sub Category not found' });
    }

    res.json({ message: 'Sub Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};
