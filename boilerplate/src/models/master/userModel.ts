import { Knex } from 'knex';
import { IUser } from '../../interfaces/authInterface';

class UserModel {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  /**
   * Find a user by their email address.
   * @param email - The email address of the user to find.
   * @returns The user with the specified email address.
   * @throws Error if the lookup fails.
   */
  public async findByEmail(email: string) {
    try {
      return await this.db('saas_admin').where({ email }).first();
    } catch (error) {
      throw new Error(`UserModel findByEmail error: ${error}`);
    }
  }

  /**
   * Find a user by their UUID.
   * @param uuid - The UUID of the user to find.
   * @returns The user with the specified UUID.
   * @throws Error if the lookup fails.
   */
  public async findByUUID(uuid: any) {
    try {
      return await this.db('saas_admin').where({ admin_uuid: uuid }).first();
    } catch (error) {
      throw new Error(`UserModel findByUUID error: ${error}`);
    }
  }

  /**
   * Create a new user.
   * @param user - Data for the new user.
   * @returns The newly created user.
   * @throws Error if the creation fails.
   */
  public async createUser(user: Partial<IUser>) {
    try {
      return await this.db('saas_admin').insert(user).returning('*');
    } catch (error) {
      throw new Error(`UserModel createUser error: ${error}`);
    }
  }
}

export default UserModel;
