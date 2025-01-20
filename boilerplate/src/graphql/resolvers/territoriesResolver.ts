import { Request } from 'express';
import TerritoriesResolver from '../../services/territories/territoriesService';

// Define resolvers for GraphQL queries related to territories
const resolvers = {
  Query: {
    /**
     * Resolver for fetching a list of countries.
     * @param _ - Parent (not used in this resolver).
     * @param args - Arguments passed to the query, typically includes sorting and filtering options.
     * @param context - Context object containing the request and database connection.
     * @returns Promise<any[]> - A promise that resolves to a list of countries.
     */
    countries: async (_: any, args: any, context: { req: Request }) => {
      // Extract the Knex database instance from the request context
      const db = (context.req as any).knex;
      // Create an instance of the TerritoriesResolver with the database instance
      const resolver = new TerritoriesResolver(db);
      // Call the getCountries method from TerritoriesResolver and return the result
      return await resolver.getCountries(args);
    },
    
    /**
     * Resolver for fetching a list of states based on the country ID.
     * @param _ - Parent (not used in this resolver).
     * @param args - Arguments passed to the query, typically includes country ID and filtering options.
     * @param context - Context object containing the request and database connection.
     * @returns Promise<any[]> - A promise that resolves to a list of states.
     */
    states: async (_: any, args: any, context: { req: Request }) => {
      // Extract the Knex database instance from the request context
      const db = (context.req as any).knex;
      // Create an instance of the TerritoriesResolver with the database instance
      const resolver = new TerritoriesResolver(db);
      // Call the getStates method from TerritoriesResolver and return the result
      return await resolver.getStates(args);
    },
    
    /**
     * Resolver for fetching a list of cities based on the state ID.
     * @param _ - Parent (not used in this resolver).
     * @param args - Arguments passed to the query, typically includes state ID and filtering options.
     * @param context - Context object containing the request and database connection.
     * @returns Promise<any[]> - A promise that resolves to a list of cities.
     */
    cities: async (_: any, args: any, context: { req: Request }) => {
      // Extract the Knex database instance from the request context
      const db = (context.req as any).knex;
      // Create an instance of the TerritoriesResolver with the database instance
      const resolver = new TerritoriesResolver(db);
      // Call the getCities method from TerritoriesResolver and return the result
      return await resolver.getCities(args);
    },
  },
};

export default resolvers;
