import { pool } from '../config/database';
import bcrypt from 'bcryptjs';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface IUser {
  id?: number;
  username: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export class User {
  static async create(userData: Omit<IUser, 'id' | 'created_at' | 'updated_at'>): Promise<IUser> {
    const { username, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    return { id: result.insertId, username, email, password: hashedPassword };
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    return rows.length > 0 ? rows[0] as IUser : null;
  }

  static async findByUsername(username: string): Promise<IUser | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    return rows.length > 0 ? rows[0] as IUser : null;
  }

  static async findById(id: number): Promise<IUser | null> {
    console.log(`User.findById called with id: ${id}`);
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    
    console.log('Database query result:', rows);
    console.log('Rows length:', rows.length);
    
    return rows.length > 0 ? rows[0] as IUser : null;
  }

  static async comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
}
