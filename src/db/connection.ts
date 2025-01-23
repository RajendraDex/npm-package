import { Knex, knex } from 'knex';
import { logger } from '../utils/logger';

class Database {
  private db: Knex | null = null;
  private config: Knex.Config;

  constructor(config: Knex.Config) {
    this.config = config;
  }

  /**
   * Attempts to establish a connection to the database.
   * If the connection fails, it retries the connection a specified number of times.
   * 
   * @param retries - The number of retries before giving up.
   * @returns The Knex instance for querying the database.
   */
  public async getConnection(retries = 2): Promise<Knex> { // Reduced retries
    if (!this.db) {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          this.db = knex(this.config);
          await this.db.raw('SELECT 1'); // Test the connection
          console.log('Connected to database');
          break; // Break out of the loop if connection is successful
        } catch (err) {
          console.error(`Failed to connect to database (attempt ${attempt}):`, err);
          if (attempt === retries) {
            logger.error('Unable to connect to the database after multiple attempts');
            throw new Error('Unable to connect to the database after multiple attempts');
          }
          await this.delay(500); // Reduced delay for faster retries
        }
      }
    }
    return this.db!;
  }

  /**
   * Executes a database operation with proper connection handling.
   * Ensures the connection is closed after the operation is complete.
   * 
   * @param operation - A function that performs the database operation.
   * @returns The result of the operation.
   */
  public static async withConnection<T>(
    config: Knex.Config,
    operation: (db: Knex) => Promise<T>
  ): Promise<T> {
    const database = new Database(config);
    try {
      const db = await database.getConnection();
      return await operation(db);
    } catch (err) {
      console.error('Error during database operation:', err);
      throw err;
    }
  }

  /**
   * Utility function to delay execution for a specified time.
   * 
   * @param ms - The delay time in milliseconds.
   * @returns A promise that resolves after the delay.
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default Database;
