import { Knex } from 'knex';

class CityModel {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  /**
   * Fetch cities for a specific state with optional sorting and searching.
   * 
   * @param stateId - The ID of the state to fetch cities for.
   * @param sortBy - The column to sort the results by. Defaults to 'city_name'.
   * @param sortOrder - The order to sort the results. Can be 'asc' or 'desc'. Defaults to 'asc'.
   * @param searchQuery - An optional search query to filter cities by name. Defaults to an empty string.
   * @returns An array of city records matching the criteria.
   * @throws Error if the query fails.
   */
  public async fetchCitiesByStateId(
    stateId: number,
    sortBy: string = 'city_name',
    sortOrder: 'asc' | 'desc' = 'asc',
    searchQuery: string = ''
  ) {
    try {
      // Default to 'city_name' if sortBy is not provided
      const column = sortBy || 'city_name';

      // Fetch all cities for the specified state with optional search and sorting
      const result = await this.db('city_master')
        .select('*')
        .where('state_id', stateId)
        .where(builder => {
          if (searchQuery) {
            builder.where('city_name', 'ILIKE', `%${searchQuery}%`);
          }
        })
        .orderBy(column, sortOrder);

      return result;
    } catch (error) {
      throw new Error(`CityModel fetchCitiesByStateId error: ${error}`);
    }
  }
}

export default CityModel;
