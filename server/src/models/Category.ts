import { pool } from '../config/database';

export interface ICategory {
  id?: number;
  name: string;
  description?: string;
  image?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class Category {
  static async findAll(): Promise<ICategory[]> {
    const [rows] = await pool.execute('SELECT * FROM categories ORDER BY created_at DESC');
    return rows as ICategory[];
  }

  static async findById(id: number): Promise<ICategory | null> {
    const [rows] = await pool.execute('SELECT * FROM categories WHERE id = ?', [id]);
    const categories = rows as ICategory[];
    return categories.length > 0 ? categories[0] : null;
  }

  static async findByName(name: string): Promise<ICategory | null> {
    const [rows] = await pool.execute('SELECT * FROM categories WHERE name = ?', [name]);
    const categories = rows as ICategory[];
    return categories.length > 0 ? categories[0] : null;
  }

  static async create(categoryData: Omit<ICategory, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const [result] = await pool.execute(
      'INSERT INTO categories (name, description, image, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [categoryData.name, categoryData.description || null, categoryData.image || null]
    );
    return (result as any).insertId;
  }

  static async update(id: number, categoryData: Partial<Omit<ICategory, 'id' | 'created_at'>>): Promise<boolean> {
    const [result] = await pool.execute(
      'UPDATE categories SET name = ?, description = ?, image = ?, updated_at = NOW() WHERE id = ?',
      [categoryData.name, categoryData.description, categoryData.image, id]
    );
    return (result as any).affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  }
}

export default Category;
