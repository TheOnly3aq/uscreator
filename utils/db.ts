/**
 * Database utility functions for MySQL/MariaDB connection
 */

import mysql from "mysql2/promise";
import { RowDataPacket } from "mysql2";

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
      type VARCHAR(10) DEFAULT 'story',
      role VARCHAR(500),
      action VARCHAR(500),
      benefit VARCHAR(500),
      background TEXT,
      acceptance_criteria JSON,
      technical_info JSON,
      is_draft BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_session_id (session_id),
      INDEX idx_session_draft (session_id, is_draft),
      INDEX idx_session_draft_type (session_id, is_draft, type),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Add is_draft column if it doesn't exist (for existing databases)
  try {
    const [columns] = await db.execute<RowDataPacket[]>(
      `SHOW COLUMNS FROM user_stories LIKE 'is_draft'`
    );
    if (columns.length === 0) {
      await db.execute(`
        ALTER TABLE user_stories 
        ADD COLUMN is_draft BOOLEAN DEFAULT FALSE
      `);
    }
  } catch {
    // Column might already exist, ignore error
  }

  // Add type column if it doesn't exist (for existing databases)
  try {
    const [columns] = await db.execute<RowDataPacket[]>(
      `SHOW COLUMNS FROM user_stories LIKE 'type'`
    );
    if (columns.length === 0) {
      await db.execute(`
        ALTER TABLE user_stories 
        ADD COLUMN type VARCHAR(10) DEFAULT 'story'
      `);
    }
  } catch {
    // Column might already exist, ignore error
  }

  // Create sessions table for storing session metadata
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      session_id VARCHAR(255) PRIMARY KEY,
      user_agent TEXT,
      ip_addresses JSON,
      first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_last_seen (last_seen)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Add ip_addresses column if it doesn't exist (for existing databases)
  try {
    const [columns] = await db.execute<RowDataPacket[]>(
      `SHOW COLUMNS FROM sessions LIKE 'ip_addresses'`
    );
    if (columns.length === 0) {
      await db.execute(`
        ALTER TABLE sessions 
        ADD COLUMN ip_addresses JSON
      `);
    }
  } catch {
    // Column might already exist, ignore error
  }
}

