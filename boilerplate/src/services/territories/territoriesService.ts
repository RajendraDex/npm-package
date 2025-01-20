import { Knex } from 'knex';
import TerritoriesFactory from '../../factories/territories/territoriesFactory';

interface QueryArgs {
  sortBy?: string; // Field to sort by
  sortOrder?: 'asc' | 'desc'; // Sort order
  searchQuery?: string; // Search query for filtering results
  countryId?: number; // Country ID for filtering states
  stateId?: number; // State ID for filtering cities
}

class TerritoriesResolver {
  private db: Knex; // Knex instance for database operations
  private territoriesFactory: TerritoriesFactory; // Factory for managing territories

  /**
   * Initializes the resolver with a Knex instance.
   * 
   * @param db - The Knex instance used for database operations.
   */
  constructor(db: Knex) {
    this.db = db;
    this.territoriesFactory = new TerritoriesFactory(this.db); // Create a new TerritoriesFactory instance
  }

  /**
   * Retrieves a list of countries based on provided query arguments.
   * 
   * @param args - Query arguments for sorting, searching, and filtering.
   * @returns A promise that resolves to a list of countries with their details.
   * @throws Error if there is an issue fetching the countries.
   */
  public async getCountries(args: QueryArgs) {
    const { sortBy = 'country_name', sortOrder = 'asc', searchQuery = '' } = args;
    try {
      // Fetch countries from the factory with provided sorting and search parameters
      const countries = await this.territoriesFactory.getAllCountries(sortBy, sortOrder, searchQuery);
      return countries.map(country => ({
        id: country.id, // Country ID
        name: country.country_name, // Country name
        createdAt: country.created_at, // Creation timestamp
        updatedAt: country.updated_at // Last update timestamp
      }));
    } catch (error) {
      throw new Error('Error fetching countries'); // Throw a generic error
    }
  }

  /**
   * Retrieves a list of states for a given country.
   * 
   * @param args - Query arguments including countryId, sorting, searching, and filtering.
   * @returns A promise that resolves to a list of states with their details.
   * @throws Error if countryId is not provided or if there is an issue fetching the states.
   */
  public async getStates(args: QueryArgs) {
    const { countryId, sortBy = 'state_name', sortOrder = 'asc', searchQuery = '' } = args;
    if (countryId === undefined) {
      throw new Error('countryId is required'); // Ensure countryId is provided
    }
    try {
      // Fetch states from the factory with provided countryId and other parameters
      const states = await this.territoriesFactory.getStatesByCountryId(countryId, sortBy, sortOrder, searchQuery);
      return states.map(state => ({
        id: state.id, // State ID
        name: state.state_name, // State name
        createdAt: state.created_at, // Creation timestamp
        updatedAt: state.updated_at // Last update timestamp
      }));
    } catch (error) {
      throw new Error('Error fetching states'); // Throw a generic error
    }
  }

  /**
   * Retrieves a list of cities for a given state.
   * 
   * @param args - Query arguments including stateId, sorting, searching, and filtering.
   * @returns A promise that resolves to a list of cities with their details.
   * @throws Error if stateId is not provided or if there is an issue fetching the cities.
   */
  public async getCities(args: QueryArgs) {
    const { stateId, sortBy = 'city_name', sortOrder = 'asc', searchQuery = '' } = args;
    if (stateId === undefined) {
      throw new Error('stateId is required'); // Ensure stateId is provided
    }
    try {
      // Fetch cities from the factory with provided stateId and other parameters
      const cities = await this.territoriesFactory.getCitiesByStateId(stateId, sortBy, sortOrder, searchQuery);
      return cities.map(city => ({
        id: city.id, // City ID
        name: city.city_name, // City name
        createdAt: city.created_at, // Creation timestamp
        updatedAt: city.updated_at // Last update timestamp
      }));
    } catch (error) {
      throw new Error('Error fetching cities'); // Throw a generic error
    }
  }
}

export default TerritoriesResolver;
