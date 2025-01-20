import { Knex } from 'knex';
import TerritoriesResolver from '../../../src/services/territories/territoriesService';
import TerritoriesFactory from '../../../src/factories/territories/territoriesFactory';

// Mock the TerritoriesFactory
jest.mock('../../../src/factories/territories/territoriesFactory');

describe('TerritoriesResolver', () => {
  let mockDb: jest.Mocked<Knex>;
  let territoriesResolver: TerritoriesResolver;

  beforeEach(() => {
    mockDb = {} as jest.Mocked<Knex>;
    territoriesResolver = new TerritoriesResolver(mockDb);
  });

  describe('getCountries', () => {
    it('should return formatted countries', async () => {
      const mockCountries = [
        { id: 1, country_name: 'USA', created_at: '2023-01-01', updated_at: '2023-01-02' },
        { id: 2, country_name: 'Canada', created_at: '2023-01-03', updated_at: '2023-01-04' },
      ];

      (TerritoriesFactory.prototype.getAllCountries as jest.Mock).mockResolvedValue(mockCountries);

      const result = await territoriesResolver.getCountries({});

      expect(result).toEqual([
        { id: 1, name: 'USA', createdAt: '2023-01-01', updatedAt: '2023-01-02' },
        { id: 2, name: 'Canada', createdAt: '2023-01-03', updatedAt: '2023-01-04' },
      ]);
    });

    it('should throw an error when getAllCountries fails', async () => {
      (TerritoriesFactory.prototype.getAllCountries as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(territoriesResolver.getCountries({})).rejects.toThrow('Error fetching countries');
    });
  });

  describe('getStates', () => {
    it('should return formatted states', async () => {
      const mockStates = [
        { id: 1, state_name: 'California', created_at: '2023-01-01', updated_at: '2023-01-02' },
        { id: 2, state_name: 'New York', created_at: '2023-01-03', updated_at: '2023-01-04' },
      ];

      (TerritoriesFactory.prototype.getStatesByCountryId as jest.Mock).mockResolvedValue(mockStates);

      const result = await territoriesResolver.getStates({ countryId: 1 });

      expect(result).toEqual([
        { id: 1, name: 'California', createdAt: '2023-01-01', updatedAt: '2023-01-02' },
        { id: 2, name: 'New York', createdAt: '2023-01-03', updatedAt: '2023-01-04' },
      ]);
    });

    it('should throw an error when countryId is not provided', async () => {
      await expect(territoriesResolver.getStates({})).rejects.toThrow('countryId is required');
    });

    it('should throw an error when getStatesByCountryId fails', async () => {
      (TerritoriesFactory.prototype.getStatesByCountryId as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(territoriesResolver.getStates({ countryId: 1 })).rejects.toThrow('Error fetching states');
    });
  });

  describe('getCities', () => {
    it('should return formatted cities', async () => {
      const mockCities = [
        { id: 1, city_name: 'Los Angeles', created_at: '2023-01-01', updated_at: '2023-01-02' },
        { id: 2, city_name: 'San Francisco', created_at: '2023-01-03', updated_at: '2023-01-04' },
      ];

      (TerritoriesFactory.prototype.getCitiesByStateId as jest.Mock).mockResolvedValue(mockCities);

      const result = await territoriesResolver.getCities({ stateId: 1 });

      expect(result).toEqual([
        { id: 1, name: 'Los Angeles', createdAt: '2023-01-01', updatedAt: '2023-01-02' },
        { id: 2, name: 'San Francisco', createdAt: '2023-01-03', updatedAt: '2023-01-04' },
      ]);
    });

    it('should throw an error when stateId is not provided', async () => {
      await expect(territoriesResolver.getCities({})).rejects.toThrow('stateId is required');
    });

    it('should throw an error when getCitiesByStateId fails', async () => {
      (TerritoriesFactory.prototype.getCitiesByStateId as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(territoriesResolver.getCities({ stateId: 1 })).rejects.toThrow('Error fetching cities');
    });
  });
});