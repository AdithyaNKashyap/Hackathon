import { pool } from '../config/database';

export interface ISubCategory {
  id?: number;
  name: string;
  description?: string;
  category_id: number;
  image?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class SubCategory {
  static async findAll(): Promise<ISubCategory[]> {
    const [rows] = await pool.execute(`
      SELECT sc.*, c.name as category_name 
      FROM subcategories sc 
      LEFT JOIN categories c ON sc.category_id = c.id 
      ORDER BY sc.created_at DESC
    `);
    return rows as ISubCategory[];
  }

  static async findById(id: number): Promise<ISubCategory | null> {
    const [rows] = await pool.execute(`
      SELECT sc.*, c.name as category_name 
      FROM subcategories sc 
      LEFT JOIN categories c ON sc.category_id = c.id 
      WHERE sc.id = ?
    `, [id]);
    const subCategories = rows as ISubCategory[];
    return subCategories.length > 0 ? subCategories[0] : null;
  }

  static async create(subCategoryData: Omit<ISubCategory, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const [result] = await pool.execute(`
      INSERT INTO subcategories (name, description, category_id, image, created_at, updated_at) 
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `, [subCategoryData.name, subCategoryData.description, subCategoryData.category_id, subCategoryData.image]);
    return (result as any).insertId;
  }

  static async update(id: number, subCategoryData: Partial<Omit<ISubCategory, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
    const [result] = await pool.execute(`
      UPDATE subcategories 
      SET name = ?, description = ?, category_id = ?, image = ?, updated_at = NOW() 
      WHERE id = ?
    `, [subCategoryData.name, subCategoryData.description, subCategoryData.category_id, subCategoryData.image, id]);
    return (result as any).affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute('DELETE FROM subcategories WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  }
}

export default SubCategory;
