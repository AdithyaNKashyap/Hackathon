import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_admin',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

export const pool = mysql.createPool(dbConfig);

export const initDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    // Drop and recreate database
    await connection.execute(`DROP DATABASE IF EXISTS ${process.env.DB_NAME || 'hackathon_db'}`);
    await connection.execute(`CREATE DATABASE ${process.env.DB_NAME || 'hackathon_db'}`);
    await connection.end();

    // Create tables
    await createTables();
    
    console.log('MySQL database connected and initialized successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

const createTables = async () => {
  const connection = await pool.getConnection();
  
  try {
    // Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Categories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Subcategories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS subcategories (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category_id INT UNSIGNED NOT NULL,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      )
    `);

    // Products table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category_id INT UNSIGNED NOT NULL,
        subcategory_id INT UNSIGNED NOT NULL,
        images JSON,
        stock INT DEFAULT 0,
        sku VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
        FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE
      )
    `);

    // Product images table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        product_id INT UNSIGNED NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables created successfully');
  } finally {
    connection.release();
  }
};
