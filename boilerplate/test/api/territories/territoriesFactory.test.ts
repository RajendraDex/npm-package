import { Knex } from 'knex';
import TerritoriesFactory from '../../../src/factories/territories/territoriesFactory';
import CountryModel from '../../../src/models/territories/countryModel';
import StateModel from '../../../src/models/territories/stateModel';
import CityModel from '../../../src/models/territories/cityModel';

// Mock the models
jest.mock('../../../src/models/territories/countryModel');
jest.mock('../../../src/models/territories/stateModel');
jest.mock('../../../src/models/territories/cityModel');

describe('TerritoriesFactory', () => {
  let territoriesFactory: TerritoriesFactory;
  let mockDb: jest.Mocked<Knex>;

  beforeEach(() => {
    mockDb = {} as jest.Mocked<Knex>;
    territoriesFactory = new TerritoriesFactory(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCountries', () => {
    it('should fetch all countries with default parameters', async () => {
      const mockCountries = [{ id: 1, name: 'Country 1' }];
      (CountryModel.prototype.fetchAllCountries as jest.Mock).mockResolvedValue(mockCountries);

      const result = await territoriesFactory.getAllCountries();

      expect(result).toEqual(mockCountries);
      expect(CountryModel.prototype.fetchAllCountries).toHaveBeenCalledWith('country_name', 'asc', '');
    });

    it('should fetch all countries with custom parameters', async () => {
      const mockCountries = [{ id: 1, name: 'Country 1' }];
      (CountryModel.prototype.fetchAllCountries as jest.Mock).mockResolvedValue(mockCountries);

      const result = await territoriesFactory.getAllCountries('id', 'desc', 'search');

      expect(result).toEqual(mockCountries);
      expect(CountryModel.prototype.fetchAllCountries).toHaveBeenCalledWith('id', 'desc', 'search');
    });

    it('should throw an error if fetching countries fails', async () => {
      const errorMessage = 'Database error';
      (CountryModel.prototype.fetchAllCountries as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(territoriesFactory.getAllCountries()).rejects.toThrow(`TerritoriesFactory getAllCountries error: Error: ${errorMessage}`);
    });
  });

  describe('getStatesByCountryId', () => {
    it('should fetch states by country ID with default parameters', async () => {
      const mockStates = [{ id: 1, name: 'State 1' }];
      (StateModel.prototype.fetchStatesByCountryId as jest.Mock).mockResolvedValue(mockStates);

      const result = await territoriesFactory.getStatesByCountryId(1);

      expect(result).toEqual(mockStates);
      expect(StateModel.prototype.fetchStatesByCountryId).toHaveBeenCalledWith(1, 'state_name', 'asc', '');
    });

    it('should fetch states by country ID with custom parameters', async () => {
      const mockStates = [{ id: 1, name: 'State 1' }];
      (StateModel.prototype.fetchStatesByCountryId as jest.Mock).mockResolvedValue(mockStates);

      const result = await territoriesFactory.getStatesByCountryId(1, 'id', 'desc', 'search');

      expect(result).toEqual(mockStates);
      expect(StateModel.prototype.fetchStatesByCountryId).toHaveBeenCalledWith(1, 'id', 'desc', 'search');
    });

    it('should throw an error if fetching states fails', async () => {
      const errorMessage = 'Database error';
      (StateModel.prototype.fetchStatesByCountryId as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(territoriesFactory.getStatesByCountryId(1)).rejects.toThrow(`TerritoriesFactory getStatesByCountryId error: Error: ${errorMessage}`);
    });
  });

  describe('getCitiesByStateId', () => {
    it('should fetch cities by state ID with default parameters', async () => {
      const mockCities = [{ id: 1, name: 'City 1' }];
      (CityModel.prototype.fetchCitiesByStateId as jest.Mock).mockResolvedValue(mockCities);

      const result = await territoriesFactory.getCitiesByStateId(1);

      expect(result).toEqual(mockCities);
      expect(CityModel.prototype.fetchCitiesByStateId).toHaveBeenCalledWith(1, 'city_name', 'asc', '');
    });

    it('should fetch cities by state ID with custom parameters', async () => {
      const mockCities = [{ id: 1, name: 'City 1' }];
      (CityModel.prototype.fetchCitiesByStateId as jest.Mock).mockResolvedValue(mockCities);

      const result = await territoriesFactory.getCitiesByStateId(1, 'id', 'desc', 'search');

      expect(result).toEqual(mockCities);
      expect(CityModel.prototype.fetchCitiesByStateId).toHaveBeenCalledWith(1, 'id', 'desc', 'search');
    });

    it('should throw an error if fetching cities fails', async () => {
      const errorMessage = 'Database error';
      (CityModel.prototype.fetchCitiesByStateId as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(territoriesFactory.getCitiesByStateId(1)).rejects.toThrow(`TerritoriesFactory getCitiesByStateId error: Error: ${errorMessage}`);
    });
  });
});