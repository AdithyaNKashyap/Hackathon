import { pool } from '../config/database';

export interface IProduct {
  id?: number;
  name: string;
  description?: string;
  price: number;
  category_id: number;
  subcategory_id: number;
  images: string[];
  stock: number;
  sku?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class Product {
  static async findAll(): Promise<IProduct[]> {
    const [rows] = await pool.execute(`
      SELECT p.*, c.name as category_name, sc.name as subcategory_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id 
      ORDER BY p.created_at DESC
    `);
    return rows as IProduct[];
  }

  static async findById(id: number): Promise<IProduct | null> {
    const [rows] = await pool.execute(`
      SELECT p.*, c.name as category_name, sc.name as subcategory_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id 
      WHERE p.id = ?
    `, [id]);
    const products = rows as IProduct[];
    return products.length > 0 ? products[0] : null;
  }

  static async create(productData: Omit<IProduct, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const [result] = await pool.execute(`
      INSERT INTO products (name, description, price, category_id, subcategory_id, images, stock, sku, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      productData.name,
      productData.description,
      productData.price,
      productData.category_id,
      productData.subcategory_id,
      JSON.stringify(productData.images),
      productData.stock,
      productData.sku
    ]);
    return (result as any).insertId;
  }

  static async update(id: number, productData: Partial<Omit<IProduct, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
    const [result] = await pool.execute(`
      UPDATE products 
      SET name = ?, description = ?, price = ?, category_id = ?, subcategory_id = ?, images = ?, stock = ?, sku = ?, updated_at = NOW() 
      WHERE id = ?
    `, [
      productData.name,
      productData.description,
      productData.price,
      productData.category_id,
      productData.subcategory_id,
      JSON.stringify(productData.images),
      productData.stock,
      productData.sku,
      id
    ]);
    return (result as any).affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  }
}

export default Product;
