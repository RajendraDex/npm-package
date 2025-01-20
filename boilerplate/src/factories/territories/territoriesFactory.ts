import { Knex } from 'knex';
import CountryModel from '../../models/territories/countryModel';
import StateModel from '../../models/territories/stateModel';
import CityModel from '../../models/territories/cityModel';

class TerritoriesFactory {
  private countryModel: CountryModel;
  private stateModel: StateModel;
  private cityModel: CityModel;

  /**
   * Initializes the TerritoriesFactory with database models for countries, states, and cities.
   * @param db - The Knex database instance to use for queries.
   */
  constructor(db: Knex) {
    this.countryModel = new CountryModel(db);
    this.stateModel = new StateModel(db);
    this.cityModel = new CityModel(db);
  }

  /**
   * Fetches all countries with optional sorting and filtering.
   * @param sortBy - The field to sort by (default is 'country_name').
   * @param sortOrder - The order of sorting ('asc' or 'desc', default is 'asc').
   * @param searchQuery - A search query to filter results (default is '').
   * @returns Promise<any[]> - A promise that resolves to the list of countries.
   */
  public async getAllCountries(sortBy: string = 'country_name', sortOrder: 'asc' | 'desc' = 'asc', searchQuery: string = '') {
    try {
      return await this.countryModel.fetchAllCountries(sortBy, sortOrder, searchQuery);
    } catch (error) {
      throw new Error(`TerritoriesFactory getAllCountries error: ${error}`);
    }
  }

  /**
   * Fetches states for a given country ID with optional sorting and filtering.
   * @param countryId - The ID of the country for which to fetch states.
   * @param sortBy - The field to sort by (default is 'state_name').
   * @param sortOrder - The order of sorting ('asc' or 'desc', default is 'asc').
   * @param searchQuery - A search query to filter results (default is '').
   * @returns Promise<any[]> - A promise that resolves to the list of states.
   */
  public async getStatesByCountryId(countryId: number, sortBy: string = 'state_name', sortOrder: 'asc' | 'desc' = 'asc', searchQuery: string = '') {
    try {
      return await this.stateModel.fetchStatesByCountryId(countryId, sortBy, sortOrder, searchQuery);
    } catch (error) {
      throw new Error(`TerritoriesFactory getStatesByCountryId error: ${error}`);
    }
  }

  /**
   * Fetches cities for a given state ID with optional sorting and filtering.
   * @param stateId - The ID of the state for which to fetch cities.
   * @param sortBy - The field to sort by (default is 'city_name').
   * @param sortOrder - The order of sorting ('asc' or 'desc', default is 'asc').
   * @param searchQuery - A search query to filter results (default is '').
   * @returns Promise<any[]> - A promise that resolves to the list of cities.
   */
  public async getCitiesByStateId(stateId: number, sortBy: string = 'city_name', sortOrder: 'asc' | 'desc' = 'asc', searchQuery: string = '') {
    try {
      return await this.cityModel.fetchCitiesByStateId(stateId, sortBy, sortOrder, searchQuery);
    } catch (error) {
      throw new Error(`TerritoriesFactory getCitiesByStateId error: ${error}`);
    }
  }
}

export default TerritoriesFactory;
