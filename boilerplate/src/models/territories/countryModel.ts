import { Knex } from 'knex';

class CountryModel {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  /**
   * Fetch all countries with optional sorting and searching.
   * 
   * @param sortBy - The column to sort the results by. Defaults to 'country_name'.
   * @param sortOrder - The order to sort the results. Can be 'asc' or 'desc'. Defaults to 'asc'.
   * @param searchQuery - An optional search query to filter countries by name. Defaults to an empty string.
   * @returns An array of country records matching the criteria.
   * @throws Error if the query fails.
   */
  public async fetchAllCountries(
    sortBy: string = 'country_name',
    sortOrder: 'asc' | 'desc' = 'asc',
    searchQuery: string = ''
  ) {
    try {
      // Default to 'country_name' if sortBy is not provided
      const column = sortBy || 'country_name';

      // Fetch all countries with optional search and sorting
      const result = await this.db('country_master')
        .select('*')
        .where(builder => {
          if (searchQuery) {
            builder.where('country_name', 'ILIKE', `%${searchQuery}%`);
          }
        })
        .orderBy(column, sortOrder);

      return result;
    } catch (error) {
      throw new Error(`CountryModel fetchAllCountries error: ${error}`);
    }
  }
}

export default CountryModel;
