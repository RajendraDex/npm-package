import { Request } from 'express';
import resolvers from '../../../src/graphql/resolvers/territoriesResolver';
import TerritoriesResolver from '../../../src/services/territories/territoriesService';
import { Knex } from 'knex';

// Mock the TerritoriesResolver class
jest.mock('../../../src/services/territories/territoriesService');

describe('Territories Resolvers', () => {
  let mockContext: { req: Request & { knex: Knex } };
  let mockTerritoriesResolver: jest.Mocked<TerritoriesResolver>;

  beforeEach(() => {
    // Create a mock context with a mock Knex instance
    mockContext = {
      req: {
        knex: {} as Knex,
      } as Request & { knex: Knex },
    };

    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create a mocked instance of TerritoriesResolver
    mockTerritoriesResolver = {
      getCountries: jest.fn(),
      getStates: jest.fn(),
      getCities: jest.fn(),
    } as unknown as jest.Mocked<TerritoriesResolver>;

    // Mock the constructor to return our mocked instance
    (TerritoriesResolver as jest.MockedClass<typeof TerritoriesResolver>).mockImplementation(() => mockTerritoriesResolver);
  });

  describe('Query.countries', () => {
    it('should call TerritoriesResolver.getCountries with correct arguments', async () => {
      const mockArgs = { sort: 'name' };
      const mockCountries = [{ id: 1, name: 'Country 1', createdAt: new Date(), updatedAt: new Date() }];

      mockTerritoriesResolver.getCountries.mockResolvedValue(mockCountries);

      const result = await resolvers.Query.countries(null, mockArgs, mockContext);

      expect(TerritoriesResolver).toHaveBeenCalledWith(mockContext.req.knex);
      expect(mockTerritoriesResolver.getCountries).toHaveBeenCalledWith(mockArgs);
      expect(result).toEqual(mockCountries);
    });
  });

  describe('Query.states', () => {
    it('should call TerritoriesResolver.getStates with correct arguments', async () => {
      const mockArgs = { countryId: 1 };
      const mockStates = [{ id: 1, name: 'State 1', createdAt: new Date(), updatedAt: new Date() }];

      mockTerritoriesResolver.getStates.mockResolvedValue(mockStates);

      const result = await resolvers.Query.states(null, mockArgs, mockContext);

      expect(TerritoriesResolver).toHaveBeenCalledWith(mockContext.req.knex);
      expect(mockTerritoriesResolver.getStates).toHaveBeenCalledWith(mockArgs);
      expect(result).toEqual(mockStates);
    });
  });

  describe('Query.cities', () => {
    it('should call TerritoriesResolver.getCities with correct arguments', async () => {
      const mockArgs = { stateId: 1 };
      const mockCities = [{ id: 1, name: 'City 1', createdAt: new Date(), updatedAt: new Date() }];

      mockTerritoriesResolver.getCities.mockResolvedValue(mockCities);

      const result = await resolvers.Query.cities(null, mockArgs, mockContext);

      expect(TerritoriesResolver).toHaveBeenCalledWith(mockContext.req.knex);
      expect(mockTerritoriesResolver.getCities).toHaveBeenCalledWith(mockArgs);
      expect(result).toEqual(mockCities);
    });
  });
});