import { Knex } from 'knex';

class StateModel {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  /**
   * Fetch all states for a given country with optional sorting and searching.
   * 
   * @param countryId - The ID of the country for which states are to be fetched.
   * @param sortBy - The column to sort the results by. Defaults to 'state_name'.
   * @param sortOrder - The order to sort the results. Can be 'asc' or 'desc'. Defaults to 'asc'.
   * @param searchQuery - An optional search query to filter states by name. Defaults to an empty string.
   * @returns An array of state records that match the criteria.
   * @throws Error if the query fails.
   */
  public async fetchStatesByCountryId(
    countryId: number,
    sortBy: string = 'state_name',
    sortOrder: 'asc' | 'desc' = 'asc',
    searchQuery: string = ''
  ) {
    try {
      // Default to 'state_name' if sortBy is not provided or is invalid
      const column = sortBy || 'state_name';

      // Fetch states for the specified country with optional search and sorting
      const result = await this.db('state_master')
        .select('*')
        .where('country_id', countryId)
        .where(builder => {
          if (searchQuery) {
            builder.where('state_name', 'ILIKE', `%${searchQuery}%`);
          }
        })
        .orderBy(column, sortOrder);

      return result;
    } catch (error) {
      // Handle and throw errors with a descriptive message
      throw new Error(`StateModel fetchStatesByCountryId error: ${error}`);
    }
  }
}

export default StateModel;
