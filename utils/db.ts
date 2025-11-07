/**
 * Database utility functions for MySQL/MariaDB connection
 */

import mysql from "mysql2/promise";

/**
 * Creates a database connection pool
 */
function createPool() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  let config;
  try {
    const url = new URL(databaseUrl);
    config = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password || ""),
      database: url.pathname.slice(1),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
  } catch (error) {
    throw new Error(
      `Invalid DATABASE_URL format. Expected format: mysql://user:password@host:port/database`
    );
    console.error(error);
  }

  return mysql.createPool(config);
}

let pool: mysql.Pool | null = null;

/**
 * Gets the database connection pool
 */
export function getPool(): mysql.Pool {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

/**
 * Initializes the database schema (creates tables if they don't exist)
 */
export async function initializeDatabase(): Promise<void> {
  const db = getPool();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS user_stories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id VARCHAR(255) NOT NULL,
      role VARCHAR(500),
      action VARCHAR(500),
      benefit VARCHAR(500),
      background TEXT,
      acceptance_criteria JSON,
      technical_info JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_session_id (session_id),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

